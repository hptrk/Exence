package com.exence.finance.modules.exchangerate.service.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.common.annotations.transaction.WriteTransactional;
import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.exchangerate.client.FrankfurterClient;
import com.exence.finance.modules.exchangerate.entity.ExchangeRate;
import com.exence.finance.modules.exchangerate.repository.ExchangeRateRepository;
import com.exence.finance.modules.exchangerate.service.ExchangeRateService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExchangeRateServiceImpl implements ExchangeRateService {

    private static final int RATE_SCALE = 10;
    private static final int AMOUNT_SCALE = 2;

    private final ExchangeRateRepository exchangeRateRepository;
    private final FrankfurterClient frankfurterClient;

    @Override
    @WriteTransactional
    public BigDecimal getRate(SupportedCurrency fromCurrency, SupportedCurrency toCurrency, LocalDate date) {
        if (fromCurrency == toCurrency) {
            return BigDecimal.ONE;
        }

        BigDecimal fromRate = getRateFromEur(fromCurrency, date);
        BigDecimal toRate = getRateFromEur(toCurrency, date);

        // rate = toRate / fromRate (how many units of toCurrency per 1 fromCurrency)
        return toRate.divide(fromRate, RATE_SCALE, RoundingMode.HALF_UP);
    }

    // using rates from memory explicitly
    @Override
    public BigDecimal getRate(
            SupportedCurrency fromCurrency,
            SupportedCurrency toCurrency,
            LocalDate date,
            Map<LocalDate, Map<SupportedCurrency, BigDecimal>> ratesCache) {
        if (fromCurrency == toCurrency) {
            return BigDecimal.ONE;
        }

        BigDecimal fromRate = fromCurrency == SupportedCurrency.EUR
                ? BigDecimal.ONE
                : ratesCache.getOrDefault(date, Map.of()).get(fromCurrency);

        BigDecimal toRate = toCurrency == SupportedCurrency.EUR
                ? BigDecimal.ONE
                : ratesCache.getOrDefault(date, Map.of()).get(toCurrency);

        if (fromRate == null || toRate == null) {
            throw new ExenceException(ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE);
        }

        return toRate.divide(fromRate, RATE_SCALE, RoundingMode.HALF_UP);
    }

    @Override
    @WriteTransactional
    public void fetchAndCacheRatesForDateRange(
            LocalDate startDate, LocalDate endDate, Set<SupportedCurrency> currencies) {
        Set<SupportedCurrency> nonEurCurrencies =
                currencies.stream().filter(c -> c != SupportedCurrency.EUR).collect(Collectors.toSet());

        if (nonEurCurrencies.isEmpty()) {
            return;
        }

        Map<LocalDate, Map<SupportedCurrency, BigDecimal>> rangeRates =
                frankfurterClient.fetchRatesForRange(startDate, endDate, nonEurCurrencies);

        Map<LocalDate, Map<SupportedCurrency, BigDecimal>> existingRatesCache =
                getRates(startDate, endDate, nonEurCurrencies);

        List<ExchangeRate> ratesToSave = new ArrayList<>();

        for (var dateEntry : rangeRates.entrySet()) {
            LocalDate rateDate = dateEntry.getKey();
            Map<SupportedCurrency, BigDecimal> dailyRates = dateEntry.getValue();

            Map<SupportedCurrency, BigDecimal> existingDailyRates = existingRatesCache.getOrDefault(rateDate, Map.of());

            for (SupportedCurrency currency : nonEurCurrencies) {
                BigDecimal rate = dailyRates.get(currency);

                if (rate != null && !existingDailyRates.containsKey(currency)) {
                    ratesToSave.add(ExchangeRate.builder()
                            .rateDate(rateDate)
                            .currency(currency)
                            .rateFromEur(rate)
                            .build());
                }
            }
        }

        if (!ratesToSave.isEmpty()) {
            exchangeRateRepository.saveAll(ratesToSave);
            log.info("Successfully fetched and cached {} new exchange rates.", ratesToSave.size());
        }
    }

    @Override
    @WriteTransactional
    public BigDecimal calculateBaseCurrencyAmount(
            BigDecimal amount,
            SupportedCurrency currency,
            SupportedCurrency baseCurrency,
            LocalDate date,
            BigDecimal exchangeRate) {
        if (currency == baseCurrency) {
            return amount;
        }

        BigDecimal rate = exchangeRate != null ? exchangeRate : getRate(currency, baseCurrency, date);
        return amount.multiply(rate).setScale(AMOUNT_SCALE, RoundingMode.HALF_UP);
    }

    // using rates from memory explicitly
    @Override
    public BigDecimal calculateBaseCurrencyAmount(
            BigDecimal amount,
            SupportedCurrency currency,
            SupportedCurrency baseCurrency,
            LocalDate date,
            Map<LocalDate, Map<SupportedCurrency, BigDecimal>> ratesCache) {
        if (currency == baseCurrency) {
            return amount;
        }

        BigDecimal rate = getRate(currency, baseCurrency, date, ratesCache);
        return amount.multiply(rate).setScale(AMOUNT_SCALE, RoundingMode.HALF_UP);
    }

    @Override
    @ReadTransactional
    public Map<LocalDate, Map<SupportedCurrency, BigDecimal>> getRates(
            LocalDate startDate, LocalDate endDate, Set<SupportedCurrency> currencies) {
        List<ExchangeRate> rates =
                exchangeRateRepository.findByRateDateBetweenAndCurrencyIn(startDate, endDate, currencies);

        // (Date -> (Currency -> Rate))
        return rates.stream()
                .collect(Collectors.groupingBy(
                        ExchangeRate::getRateDate,
                        Collectors.toMap(ExchangeRate::getCurrency, ExchangeRate::getRateFromEur)));
    }

    /**
     * Get the rate from EUR for a specific currency on a specific date.
     * EUR always returns 1.0. Other currencies are looked up in cache (DB) or fetched from API.
     */
    private BigDecimal getRateFromEur(SupportedCurrency currency, LocalDate date) {
        if (currency == SupportedCurrency.EUR) {
            return BigDecimal.ONE;
        }

        return exchangeRateRepository
                .findRateByRateDateAndCurrency(date, currency)
                .orElseGet(() -> fetchAndCacheRateForDate(currency, date));
    }

    private BigDecimal fetchAndCacheRateForDate(SupportedCurrency currency, LocalDate date) {
        Map<SupportedCurrency, BigDecimal> rates = frankfurterClient.fetchRatesForDate(date, Set.of(currency));
        BigDecimal rate = rates.get(currency);

        if (rate == null) {
            throw new ExenceException(ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE);
        }

        // Cache all rates from API response
        for (var entry : rates.entrySet()) {
            if (!exchangeRateRepository.existsByRateDateAndCurrency(date, entry.getKey())) {
                exchangeRateRepository.save(ExchangeRate.builder()
                        .rateDate(date)
                        .currency(entry.getKey())
                        .rateFromEur(entry.getValue())
                        .build());
            }
        }

        return rate;
    }
}
