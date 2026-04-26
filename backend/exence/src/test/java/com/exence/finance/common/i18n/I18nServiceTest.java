package com.exence.finance.common.i18n;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.exence.finance.common.dto.SupportedCurrency;
import java.math.BigDecimal;
import java.util.Locale;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

@ExtendWith(MockitoExtension.class)
class I18nServiceTest {

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private I18nService i18nService;

    @BeforeEach
    void setUp() {
        LocaleContextHolder.setLocale(Locale.ENGLISH);
    }

    @AfterEach
    void tearDown() {
        LocaleContextHolder.resetLocaleContext();
    }

    // --- get ---

    @Test
    @DisplayName("get with no args delegates to MessageSource with null args array")
    void get_noArgs() {
        given(messageSource.getMessage("some.key", null, Locale.ENGLISH)).willReturn("resolved");

        String result = i18nService.get("some.key");

        assertThat(result).isEqualTo("resolved");
        then(messageSource).should().getMessage("some.key", null, Locale.ENGLISH);
    }

    @Test
    @DisplayName("get with args forwards args to MessageSource")
    void get_withArgs() {
        Object[] args = {"John", 42};
        given(messageSource.getMessage("greeting", args, Locale.ENGLISH)).willReturn("Hello John, you are 42");

        String result = i18nService.get("greeting", args);

        assertThat(result).isEqualTo("Hello John, you are 42");
        then(messageSource).should().getMessage("greeting", args, Locale.ENGLISH);
    }

    // --- getMonthName ---

    @Test
    @DisplayName("getMonthName returns short English name for January")
    void getMonthName_january() {
        assertThat(i18nService.getMonthName(1)).isEqualTo("Jan");
    }

    @Test
    @DisplayName("getMonthName returns short English name for December")
    void getMonthName_december() {
        assertThat(i18nService.getMonthName(12)).isEqualTo("Dec");
    }

    // --- getDayName ---

    @Test
    @DisplayName("getDayName returns short English name for Monday (ISO 1)")
    void getDayName_monday() {
        assertThat(i18nService.getDayName(1)).isEqualTo("Mon");
    }

    @Test
    @DisplayName("getDayName returns short English name for Sunday (ISO 7)")
    void getDayName_sunday() {
        assertThat(i18nService.getDayName(7)).isEqualTo("Sun");
    }

    // --- getCurrencySymbol ---

    @Test
    @DisplayName("getCurrencySymbol returns symbol for the current locale")
    void getCurrencySymbol_returnsLocaleSymbol() {
        String result = i18nService.getCurrencySymbol(SupportedCurrency.EUR);

        assertThat(result).isEqualTo(SupportedCurrency.EUR.getSymbol(Locale.ENGLISH));
    }

    // --- getUnitLabel ---

    @Test
    @DisplayName("getUnitLabel returns singular key when value is 1")
    void getUnitLabel_singular() {
        given(messageSource.getMessage("unit.day", null, Locale.ENGLISH)).willReturn("day");

        String result = i18nService.getUnitLabel(1, "unit.day", "unit.days");

        assertThat(result).isEqualTo("day");
        then(messageSource).should().getMessage("unit.day", null, Locale.ENGLISH);
    }

    @Test
    @DisplayName("getUnitLabel returns plural key when value is not 1")
    void getUnitLabel_plural() {
        given(messageSource.getMessage("unit.days", null, Locale.ENGLISH)).willReturn("days");

        String result = i18nService.getUnitLabel(2, "unit.day", "unit.days");

        assertThat(result).isEqualTo("days");
        then(messageSource).should().getMessage("unit.days", null, Locale.ENGLISH);
    }

    @Test
    @DisplayName("getUnitLabel uses compareTo so BigDecimal 1.0 is treated as singular")
    void getUnitLabel_bigDecimalOneDotZeroIsSingular() {
        given(messageSource.getMessage("unit.day", null, Locale.ENGLISH)).willReturn("day");

        String result = i18nService.getUnitLabel(BigDecimal.valueOf(1.0), "unit.day", "unit.days");

        assertThat(result).isEqualTo("day");
    }

    @Test
    @DisplayName("getUnitLabel returns plural key when value is 0")
    void getUnitLabel_zero() {
        given(messageSource.getMessage("unit.days", null, Locale.ENGLISH)).willReturn("days");

        String result = i18nService.getUnitLabel(0, "unit.day", "unit.days");

        assertThat(result).isEqualTo("days");
    }
}
