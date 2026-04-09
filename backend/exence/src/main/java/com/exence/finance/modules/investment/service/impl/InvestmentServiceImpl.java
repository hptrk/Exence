package com.exence.finance.modules.investment.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.auth.service.UserSettingsService;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import com.exence.finance.modules.investment.dto.InvestmentCreateDTO;
import com.exence.finance.modules.investment.dto.InvestmentGetDTO;
import com.exence.finance.modules.investment.dto.InvestmentGroupDTO;
import com.exence.finance.modules.investment.dto.InvestmentPatchDTO;
import com.exence.finance.modules.investment.entity.Investment;
import com.exence.finance.modules.investment.mapper.InvestmentMapper;
import com.exence.finance.modules.investment.repository.InvestmentRepository;
import com.exence.finance.modules.investment.service.InvestmentService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InvestmentServiceImpl implements InvestmentService {

    private final InvestmentRepository investmentRepository;
    private final UserService userService;
    private final UserSettingsService userSettingsService;
    private final ExchangeRateService exchangeRateService;
    private final InvestmentMapper investmentMapper;

    @Override
    @ReadTransactional
    public List<InvestmentGetDTO> getInvestments() {
        return investmentRepository.findAllUserFiltered().stream()
                .map(investmentMapper::mapToGetDTO)
                .toList();
    }

    @Override
    @ReadTransactional
    public List<InvestmentGroupDTO> getGroupedInvestments() {
        List<Investment> investments = investmentRepository.findAllUserFiltered();

        Map<String, List<Investment>> grouped =
                investments.stream().collect(Collectors.groupingBy(Investment::getAsset));

        return grouped.entrySet().stream()
                .map(entry -> {
                    String assetName = entry.getKey();
                    List<Investment> group = entry.getValue();

                    Investment latest = group.stream()
                            .max(Comparator.comparing(Investment::getPurchaseDate))
                            .orElseThrow();
                    long daysSinceLastAction = ChronoUnit.DAYS.between(latest.getPurchaseDate(), LocalDate.now());

                    BigDecimal totalInvested = group.stream()
                            .map(Investment::getBaseCurrencyAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    List<InvestmentGetDTO> purchases = group.stream()
                            .sorted(Comparator.comparing(Investment::getPurchaseDate)
                                    .reversed())
                            .map(investmentMapper::mapToGetDTO)
                            .toList();

                    return new InvestmentGroupDTO(
                            assetName, daysSinceLastAction, totalInvested, latest.getType(), group.size(), purchases);
                })
                .sorted(Comparator.comparing(InvestmentGroupDTO::daysSinceLastAction))
                .toList();
    }

    @Override
    @WriteTransactional
    public InvestmentGetDTO createInvestment(InvestmentCreateDTO dto) {
        Investment investment = investmentMapper.mapFromCreateDTO(dto);
        investment.setUser(userService.getCurrentUser());

        SupportedCurrency baseCurrency = userSettingsService.getUserBaseCurrency();
        investment.setBaseCurrencyAmount(
                calculateBaseCurrencyAmount(dto.amount(), dto.currency(), baseCurrency, dto.purchaseDate()));

        return investmentMapper.mapToGetDTO(investmentRepository.save(investment));
    }

    @Override
    @WriteTransactional
    public InvestmentGetDTO patchInvestment(Long id, InvestmentPatchDTO dto) {
        Investment investment = getInvestment(id);

        investmentMapper.updateInvestmentFromPatchDTO(dto, investment);

        if (dto.amount() != null || dto.purchaseDate() != null) {
            SupportedCurrency baseCurrency = userSettingsService.getUserBaseCurrency();
            investment.setBaseCurrencyAmount(calculateBaseCurrencyAmount(
                    investment.getAmount(), investment.getCurrency(), baseCurrency, investment.getPurchaseDate()));
        }

        return investmentMapper.mapToGetDTO(investmentRepository.save(investment));
    }

    @Override
    @WriteTransactional
    public void deleteInvestment(Long id) {
        Investment investment = getInvestment(id);
        investmentRepository.delete(investment);
    }

    private Investment getInvestment(Long id) {
        return investmentRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.INVESTMENT_NOT_FOUND));
    }

    private BigDecimal calculateBaseCurrencyAmount(
            BigDecimal amount, SupportedCurrency currency, SupportedCurrency baseCurrency, LocalDate date) {
        if (currency == baseCurrency) {
            return amount;
        }
        BigDecimal rate = exchangeRateService.getRate(currency, baseCurrency, date);
        return exchangeRateService.calculateBaseCurrencyAmount(amount, currency, baseCurrency, date, rate);
    }
}
