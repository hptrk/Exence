package com.exence.finance.modules.exchangerate.client;

import com.exence.finance.common.dto.SupportedCurrency;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Component
@RequiredArgsConstructor
public class FrankfurterClient {

    private final RestTemplate frankfurterRestTemplate;

    /**
     * Fetch exchange rates for a specific date. Returns a map of currency -> rate (1 EUR = X currency).
     */
    public Map<SupportedCurrency, BigDecimal> fetchRatesForDate(LocalDate date, Set<SupportedCurrency> currencies) {
        String path = buildPath(date, currencies);

        var response = frankfurterRestTemplate.exchange(
                path, HttpMethod.GET, null, new ParameterizedTypeReference<List<FrankfurterRateResponse>>() {});

        List<FrankfurterRateResponse> rates = response.getBody();

        return rates.stream().collect(Collectors.toMap(FrankfurterRateResponse::quote, FrankfurterRateResponse::rate));
    }

    /**
     * Fetch exchange rates for a date range. Returns a map of date -> (currency -> rate).
     */
    public Map<LocalDate, Map<SupportedCurrency, BigDecimal>> fetchRatesForRange(
            LocalDate startDate, LocalDate endDate, Set<SupportedCurrency> currencies) {
        String path = buildPath(startDate, endDate, currencies);
        var response = frankfurterRestTemplate.exchange(
                path, HttpMethod.GET, null, new ParameterizedTypeReference<List<FrankfurterRateResponse>>() {});

        List<FrankfurterRateResponse> rates = response.getBody();

        return rates.stream()
                .collect(Collectors.groupingBy(
                        FrankfurterRateResponse::date,
                        Collectors.toMap(FrankfurterRateResponse::quote, FrankfurterRateResponse::rate)));
    }

    private String buildPath(LocalDate date, Set<SupportedCurrency> currencies) {
        return getBaseUriBuilder(currencies).queryParam("date", date).toUriString();
    }

    private String buildPath(LocalDate startDate, LocalDate endDate, Set<SupportedCurrency> currencies) {
        return getBaseUriBuilder(currencies)
                .queryParam("from", startDate)
                .queryParam("to", endDate)
                .toUriString();
    }

    private UriComponentsBuilder getBaseUriBuilder(Set<SupportedCurrency> currencies) {
        return UriComponentsBuilder.fromPath("/rates")
                .queryParam("base", SupportedCurrency.EUR.getCode())
                .queryParam("quotes", getQuotes(currencies));
    }

    private String getQuotes(Set<SupportedCurrency> currencies) {
        return currencies.stream()
                .filter(currency -> currency != SupportedCurrency.EUR)
                .map(SupportedCurrency::getCode)
                .collect(Collectors.joining(","));
    }
}
