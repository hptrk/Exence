package com.exence.finance.common.i18n;

import com.exence.finance.common.dto.SupportedCurrency;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Month;
import java.time.format.TextStyle;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class I18nService {

    private final MessageSource messageSource;

    public String get(String key) {
        return messageSource.getMessage(key, null, LocaleContextHolder.getLocale());
    }

    public String get(String key, Object... args) {
        return messageSource.getMessage(key, args, LocaleContextHolder.getLocale());
    }

    public String getMonthName(int monthNum) {
        return Month.of(monthNum).getDisplayName(TextStyle.SHORT, LocaleContextHolder.getLocale());
    }

    /** @param isoDayOfWeek ISO day-of-week (1 = Monday, 7 = Sunday) */
    public String getDayName(int isoDayOfWeek) {
        return DayOfWeek.of(isoDayOfWeek).getDisplayName(TextStyle.SHORT, LocaleContextHolder.getLocale());
    }

    public String getCurrencySymbol(SupportedCurrency currency) {
        return currency.getSymbol(LocaleContextHolder.getLocale());
    }

    public String getUnitLabel(Number value, String singularKey, String pluralKey) {
        BigDecimal bd = value instanceof BigDecimal bigDecimal ? bigDecimal : BigDecimal.valueOf(value.doubleValue());
        String key = bd.compareTo(BigDecimal.ONE) == 0 ? singularKey : pluralKey;
        return get(key);
    }
}
