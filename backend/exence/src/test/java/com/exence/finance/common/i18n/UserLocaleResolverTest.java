package com.exence.finance.common.i18n;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Locale;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class UserLocaleResolverTest {

    private final UserLocaleResolver resolver = new UserLocaleResolver();

    @Test
    @DisplayName("returns English locale when Accept-Language header is absent")
    void resolveLocale_noHeader() {
        MockHttpServletRequest request = new MockHttpServletRequest();

        assertThat(resolver.resolveLocale(request)).isEqualTo(Locale.ENGLISH);
    }

    @Test
    @DisplayName("returns English locale when Accept-Language header is empty")
    void resolveLocale_emptyHeader() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Accept-Language", "");

        assertThat(resolver.resolveLocale(request)).isEqualTo(Locale.ENGLISH);
    }

    @Test
    @DisplayName("returns English locale when Accept-Language header is blank")
    void resolveLocale_blankHeader() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Accept-Language", "   ");

        assertThat(resolver.resolveLocale(request)).isEqualTo(Locale.ENGLISH);
    }

    @Test
    @DisplayName("delegates to super when Accept-Language header is present and returns a non-null locale")
    void resolveLocale_validHeader() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Accept-Language", "hu-HU,hu;q=0.9,en;q=0.8");

        Locale result = resolver.resolveLocale(request);

        assertThat(result).isNotNull();
        assertThat(result.getLanguage()).isEqualTo("hu");
    }

    @Test
    @DisplayName("throws UnsupportedOperationException on setLocale")
    void setLocale_throwsUnsupportedOperation() {
        MockHttpServletRequest request = new MockHttpServletRequest();

        assertThatThrownBy(() -> resolver.setLocale(request, null, Locale.ENGLISH))
                .isInstanceOf(UnsupportedOperationException.class);
    }
}
