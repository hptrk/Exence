package com.exence.finance.modules.debt.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.category.repository.CategoryRepository;
import com.exence.finance.modules.debt.dto.DebtCreateDTO;
import com.exence.finance.modules.debt.dto.DebtGetDTO;
import com.exence.finance.modules.debt.dto.DebtPatchDTO;
import com.exence.finance.modules.debt.dto.DebtPaymentDTO;
import com.exence.finance.modules.debt.entity.Debt;
import com.exence.finance.modules.debt.enums.DebtStatus;
import com.exence.finance.modules.debt.enums.DebtType;
import com.exence.finance.modules.debt.event.DebtSettledEvent;
import com.exence.finance.modules.debt.mapper.DebtMapper;
import com.exence.finance.modules.debt.repository.DebtRepository;
import com.exence.finance.modules.debt.service.DebtService;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DebtServiceImpl implements DebtService {

    private final DebtRepository debtRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final ExchangeRateService exchangeRateService;
    private final DebtMapper debtMapper;
    private final ApplicationEventPublisher eventPublisher;

    @ReadTransactional
    public List<DebtGetDTO> getDebts(List<DebtStatus> statuses, DebtType type) {
        boolean hasStatuses = statuses != null && !statuses.isEmpty();
        boolean hasType = type != null;

        // TODO: dynamic querydsl for filters
        List<Debt> debts;
        if (hasStatuses && hasType) {
            debts = debtRepository.findByStatusInAndType(statuses, type);
        } else if (hasStatuses) {
            debts = debtRepository.findByStatusIn(statuses);
        } else if (hasType) {
            debts = debtRepository.findByType(type);
        } else {
            debts = debtRepository.findAllUserFiltered();
        }
        return debts.stream().map(debtMapper::mapToGetDTO).toList();
    }

    @ReadTransactional
    public DebtGetDTO getDebtById(Long id) {
        return debtMapper.mapToGetDTO(getDebt(id));
    }

    @WriteTransactional
    public DebtGetDTO createDebt(DebtCreateDTO dto) {
        Category category = categoryRepository
                .find(dto.categoryId())
                .orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));

        Debt debt = debtMapper.mapFromCreateDTO(dto);
        debt.setUser(userService.getCurrentUser());
        debt.setCategory(category);
        debt.setRemainingAmount(dto.originalAmount());
        debt.setStatus(DebtStatus.ACTIVE);

        BigDecimal originalBaseCurrencyAmount =
                exchangeRateService.calculateBaseCurrencyAmount(dto.originalAmount(), dto.currency(), LocalDate.now());
        debt.setOriginalBaseCurrencyAmount(originalBaseCurrencyAmount);
        debt.setRemainingBaseCurrencyAmount(originalBaseCurrencyAmount);

        Debt savedDebt = debtRepository.save(debt);
        eventPublisher.publishEvent(savedDebt.getUser().getId());
        return debtMapper.mapToGetDTO(savedDebt);
    }

    @WriteTransactional
    public DebtGetDTO patchDebt(Long id, DebtPatchDTO dto) {
        Debt debt = getDebt(id);
        DebtStatus previousStatus = debt.getStatus();

        if (dto.categoryId() != null
                && !dto.categoryId().equals(debt.getCategory().getId())) {
            Category category = categoryRepository
                    .find(dto.categoryId())
                    .orElseThrow(() -> new ExenceException(ErrorCode.CATEGORY_NOT_FOUND));
            debt.setCategory(category);
        }

        debtMapper.updateDebtFromPatchDTO(dto, debt);
        Debt savedDebt = debtRepository.save(debt);

        if (savedDebt.getStatus() == DebtStatus.SETTLED && previousStatus != DebtStatus.SETTLED) {
            eventPublisher.publishEvent(new DebtSettledEvent(savedDebt.getUser().getId()));
        }

        return debtMapper.mapToGetDTO(savedDebt);
    }

    @WriteTransactional
    public DebtGetDTO makePayment(Long id, DebtPaymentDTO dto) {
        Debt debt = getDebt(id);

        if (dto.amount().compareTo(debt.getRemainingAmount()) > 0) {
            throw new ExenceException(ErrorCode.DEBT_PAYMENT_EXCEEDS_REMAINING);
        }

        SupportedCurrency currency = debt.getCurrency();

        BigDecimal newRemaining = debt.getRemainingAmount().subtract(dto.amount());
        debt.setRemainingAmount(newRemaining);

        BigDecimal paymentBase =
                exchangeRateService.calculateBaseCurrencyAmount(dto.amount(), currency, LocalDate.now());
        BigDecimal newRemainingBase =
                debt.getRemainingBaseCurrencyAmount().subtract(paymentBase).max(BigDecimal.ZERO);
        debt.setRemainingBaseCurrencyAmount(newRemainingBase);

        boolean nowSettled = newRemaining.compareTo(BigDecimal.ZERO) == 0;
        if (nowSettled) {
            debt.setStatus(DebtStatus.SETTLED);
        }

        Debt savedDebt = debtRepository.save(debt);
        if (nowSettled) {
            eventPublisher.publishEvent(new DebtSettledEvent(savedDebt.getUser().getId()));
        }
        return debtMapper.mapToGetDTO(savedDebt);
    }

    @WriteTransactional
    public void deleteDebt(Long id) {
        Debt debt = getDebt(id);
        debtRepository.delete(debt);
    }

    @WriteTransactional
    public int expireOverdueDebts() {
        return debtRepository.expireOverdueDebts(DebtStatus.EXPIRED, LocalDate.now(), DebtStatus.ACTIVE);
    }

    private Debt getDebt(Long id) {
        return debtRepository.find(id).orElseThrow(() -> new ExenceException(ErrorCode.DEBT_NOT_FOUND));
    }
}
