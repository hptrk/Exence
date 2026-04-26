package com.exence.finance.modules.exchangerate.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.auth.service.UserSettingsService;
import com.exence.finance.modules.exchangerate.client.FrankfurterClient;
import com.exence.finance.modules.exchangerate.entity.ExchangeRate;
import com.exence.finance.modules.exchangerate.repository.ExchangeRateRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExchangeRateServiceImplTest {

    @Mock
    private ExchangeRateRepository exchangeRateRepository;

    @Mock
    private FrankfurterClient frankfurterClient;

    @Mock
    private UserSettingsService userSettingsService;

    @InjectMocks
    private ExchangeRateServiceImpl exchangeRateService;

    private static final LocalDate DATE = LocalDate.of(2025, 1, 15);

    @Test
    @DisplayName("returns 1 when from and to currency are the same")
    void getRate_sameCurrency() {
        // given / when
        BigDecimal result = exchangeRateService.getRate(SupportedCurrency.EUR, SupportedCurrency.EUR, DATE);

        // then
        assertThat(result).isEqualByComparingTo(BigDecimal.ONE);
        then(exchangeRateRepository).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("returns cached rate from DB when available")
    void getRate_directRate() {
        // given
        BigDecimal usdRate = new BigDecimal("1.0800");
        BigDecimal eurRate = BigDecimal.ONE;
        given(exchangeRateRepository.findRateByRateDateAndCurrency(DATE, SupportedCurrency.USD))
                .willReturn(Optional.of(usdRate));

        // when
        BigDecimal result = exchangeRateService.getRate(SupportedCurrency.EUR, SupportedCurrency.USD, DATE);

        // then
        assertThat(result).isEqualByComparingTo(usdRate.divide(eurRate, 10, RoundingMode.HALF_UP));
        then(frankfurterClient).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("fetches from API when rate is not in DB")
    void getRate_notCached() {
        // given
        BigDecimal fetchedRate = new BigDecimal("1.0800");
        given(exchangeRateRepository.findRateByRateDateAndCurrency(DATE, SupportedCurrency.USD))
                .willReturn(Optional.empty());
        given(frankfurterClient.fetchRatesForDate(eq(DATE), anySet()))
                .willReturn(Map.of(SupportedCurrency.USD, fetchedRate));
        given(exchangeRateRepository.existsByRateDateAndCurrency(DATE, SupportedCurrency.USD))
                .willReturn(false);
        given(exchangeRateRepository.save(any())).willReturn(null);

        // when
        exchangeRateService.getRate(SupportedCurrency.EUR, SupportedCurrency.USD, DATE);

        // then
        then(frankfurterClient).should().fetchRatesForDate(eq(DATE), anySet());
        then(exchangeRateRepository).should().save(any(ExchangeRate.class));
    }

    @Test
    @DisplayName("throws EXCHANGE_RATE_NOT_AVAILABLE when API returns no rate")
    void getRate_apiReturnsNull() {
        // given
        given(exchangeRateRepository.findRateByRateDateAndCurrency(DATE, SupportedCurrency.USD))
                .willReturn(Optional.empty());
        given(frankfurterClient.fetchRatesForDate(eq(DATE), anySet())).willReturn(Map.of());

        // when / then
        assertThatThrownBy(() -> exchangeRateService.getRate(SupportedCurrency.EUR, SupportedCurrency.USD, DATE))
                .isInstanceOf(ExenceException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.EXCHANGE_RATE_NOT_AVAILABLE);
    }

    @Test
    @DisplayName("divides EUR rates correctly for cross-currency calculation")
    void getRate_crossViaEur() {
        // given
        BigDecimal usdFromEur = new BigDecimal("1.0800");
        BigDecimal hufFromEur = new BigDecimal("400.00");

        given(exchangeRateRepository.findRateByRateDateAndCurrency(DATE, SupportedCurrency.USD))
                .willReturn(Optional.of(usdFromEur));
        given(exchangeRateRepository.findRateByRateDateAndCurrency(DATE, SupportedCurrency.HUF))
                .willReturn(Optional.of(hufFromEur));

        // when
        BigDecimal result = exchangeRateService.getRate(SupportedCurrency.USD, SupportedCurrency.HUF, DATE);

        // then
        BigDecimal expected = hufFromEur.divide(usdFromEur, 10, RoundingMode.HALF_UP);
        assertThat(result).isEqualByComparingTo(expected);
    }

    @Test
    @DisplayName("only saves rates that are not already in the DB")
    void fetchAndCache_missingDatesOnly() {
        // given
        LocalDate start = DATE;
        LocalDate end = DATE;
        Set<SupportedCurrency> currencies = Set.of(SupportedCurrency.USD, SupportedCurrency.EUR);
        BigDecimal rate = new BigDecimal("1.0800");

        given(frankfurterClient.fetchRatesForRange(start, end, Set.of(SupportedCurrency.USD)))
                .willReturn(Map.of(start, Map.of(SupportedCurrency.USD, rate)));
        given(exchangeRateRepository.findByRateDateBetweenAndCurrencyIn(start, end, Set.of(SupportedCurrency.USD)))
                .willReturn(List.of());

        // when
        exchangeRateService.fetchAndCacheRatesForDateRange(start, end, currencies);

        // then
        then(exchangeRateRepository).should().saveAll(any());
    }

    @Test
    @DisplayName("skips save when all currencies in range are EUR only")
    void fetchAndCache_eurOnly() {
        // given
        Set<SupportedCurrency> onlyEur = Set.of(SupportedCurrency.EUR);

        // when
        exchangeRateService.fetchAndCacheRatesForDateRange(DATE, DATE, onlyEur);

        // then
        then(frankfurterClient).should(never()).fetchRatesForRange(any(), any(), any());
        then(exchangeRateRepository).should(never()).saveAll(any());
    }

    @Test
    @DisplayName("returns correct product of amount and rate")
    void calculateBase_valid() {
        // given
        BigDecimal amount = new BigDecimal("100.00");
        BigDecimal rate = new BigDecimal("0.9200");

        // when
        BigDecimal result = exchangeRateService.calculateBaseCurrencyAmount(amount, SupportedCurrency.USD, DATE, rate);

        // then
        assertThat(result).isEqualByComparingTo(new BigDecimal("92.00"));
    }

    @Test
    @DisplayName("returns amount unchanged when currency equals base currency")
    void calculateBase_sameCurrency() {
        // given
        BigDecimal amount = new BigDecimal("100.00");
        given(userSettingsService.getUserBaseCurrency()).willReturn(SupportedCurrency.EUR);

        // when
        BigDecimal result = exchangeRateService.calculateBaseCurrencyAmount(amount, SupportedCurrency.EUR, DATE);

        // then
        assertThat(result).isEqualByComparingTo(amount);
        then(exchangeRateRepository).shouldHaveNoInteractions();
    }
}
