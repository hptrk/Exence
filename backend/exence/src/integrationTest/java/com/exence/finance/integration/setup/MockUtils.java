package com.exence.finance.integration.setup;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.exchangerate.client.FrankfurterClient;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import org.mockito.Mockito;
import org.springframework.mail.javamail.JavaMailSender;

public final class MockUtils {

    private MockUtils() {}

    public static void setupJavaMailSenderMocks(JavaMailSender mailSender) {
        Session session = Session.getInstance(new Properties());
        var mimeMessage = new MimeMessage(session);

        Mockito.when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    public static void setupFrankfurterMock(FrankfurterClient frankfurterClient) {
        Mockito.lenient()
                .when(frankfurterClient.fetchRatesForDate(any(LocalDate.class), anySet()))
                .thenAnswer(invocation -> {
                    Set<SupportedCurrency> currencies = invocation.getArgument(1);
                    return buildMockRates(currencies);
                });

        Mockito.lenient()
                .when(frankfurterClient.fetchRatesForRange(any(LocalDate.class), any(LocalDate.class), anySet()))
                .thenAnswer(invocation -> {
                    LocalDate startDate = invocation.getArgument(0);
                    LocalDate endDate = invocation.getArgument(1);
                    Set<SupportedCurrency> currencies = invocation.getArgument(2);

                    Map<LocalDate, Map<SupportedCurrency, BigDecimal>> ratesByDate = new LinkedHashMap<>();
                    for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                        ratesByDate.put(date, buildMockRates(currencies));
                    }

                    return ratesByDate;
                });
    }

    private static Map<SupportedCurrency, BigDecimal> buildMockRates(Set<SupportedCurrency> currencies) {
        Map<SupportedCurrency, BigDecimal> rates = new EnumMap<>(SupportedCurrency.class);

        for (SupportedCurrency currency : currencies) {
            rates.put(currency, mockRate(currency));
        }

        return rates;
    }

    private static BigDecimal mockRate(SupportedCurrency currency) {
        return switch (currency) {
            case EUR -> BigDecimal.ONE;
            case HUF -> BigDecimal.valueOf(390.0);
            case USD -> BigDecimal.valueOf(1.08);
            case CAD -> BigDecimal.valueOf(1.47);
            case GBP -> BigDecimal.valueOf(0.86);
            case CHF -> BigDecimal.valueOf(0.95);
            case PLN -> BigDecimal.valueOf(4.28);
            case CZK -> BigDecimal.valueOf(24.95);
            case RON -> BigDecimal.valueOf(4.97);
        };
    }
}
