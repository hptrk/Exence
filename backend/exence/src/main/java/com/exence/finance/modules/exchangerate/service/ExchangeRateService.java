package com.exence.finance.modules.exchangerate.service;

import com.exence.finance.common.dto.SupportedCurrency;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.Set;

public interface ExchangeRateService {

    /**
     * Get the exchange rate between two currencies for a given date.
     * The rate represents: 1 fromCurrency = X toCurrency.
     * Fetches from API and caches in DB if not already cached.
     */
    BigDecimal getRate(SupportedCurrency fromCurrency, SupportedCurrency toCurrency, LocalDate date);

    /**
     * Get the exchange rate between two currencies for a given date.
     * The rate represents: 1 fromCurrency = X toCurrency.
     * Calculates from given ratesCache param.
     */
    BigDecimal getRate(
            SupportedCurrency fromCurrency,
            SupportedCurrency toCurrency,
            LocalDate date,
            Map<LocalDate, Map<SupportedCurrency, BigDecimal>> ratesCache);

    /**
     * Fetch and cache exchange rates for a date range and set of currencies.
     * Used for bulk operations like base currency change.
     */
    void fetchAndCacheRatesForDateRange(LocalDate startDate, LocalDate endDate, Set<SupportedCurrency> currencies);

    /**
     * Convert amount to base currency. Fetches the current user's base currency and exchange rate.
     */
    BigDecimal calculateBaseCurrencyAmount(BigDecimal amount, SupportedCurrency currency, LocalDate date);

    /**
     * Convert amount to base currency using a pre-fetched rate.
     * The caller is responsible for the same-currency check before calling this.
     */
    BigDecimal calculateBaseCurrencyAmount(
            BigDecimal amount, SupportedCurrency currency, LocalDate date, BigDecimal rate);

    /**
     * Convert amount to base currency using a rates cache (bulk operations).
     * Fetches the current user's base currency internally.
     */
    BigDecimal calculateBaseCurrencyAmount(
            BigDecimal amount,
            SupportedCurrency currency,
            LocalDate date,
            Map<LocalDate, Map<SupportedCurrency, BigDecimal>> ratesCache);

    Map<LocalDate, Map<SupportedCurrency, BigDecimal>> getRates(
            LocalDate startDate, LocalDate endDate, Set<SupportedCurrency> currencies);
}
