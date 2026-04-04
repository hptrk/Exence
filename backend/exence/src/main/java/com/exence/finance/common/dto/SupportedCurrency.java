package com.exence.finance.common.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.Currency;
import java.util.Locale;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SupportedCurrency {
    HUF("HUF"),
    EUR("EUR"),
    USD("USD"),
    CAD("CAD"),
    GBP("GBP"),
    CHF("CHF"),
    PLN("PLN"),
    CZK("CZK"),
    RON("RON");

    private final String code;

    public String getSymbol(Locale locale) {
        return Currency.getInstance(code).getSymbol(locale);
    }

    @JsonCreator
    public static SupportedCurrency fromCode(String code) {
        for (SupportedCurrency currency : values()) {
            if (currency.code.equalsIgnoreCase(code)) {
                return currency;
            }
        }
        throw new IllegalArgumentException("Unsupported currency code: " + code);
    }
}
