package com.exence.finance.modules.auth.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.exence.finance.config.properties.ExenceProperties;
import com.exence.finance.config.properties.JwtProperties;
import jakarta.servlet.http.Cookie;
import java.time.Duration;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseCookie;
import org.springframework.mock.web.MockHttpServletRequest;

@ExtendWith(MockitoExtension.class)
class CookieServiceImplTest {

    @Mock
    private JwtProperties jwtProperties;

    @Mock
    private ExenceProperties exenceProperties;

    @InjectMocks
    private CookieServiceImpl service;

    @Test
    @DisplayName("create access token cookie valid")
    void createAccessTokenCookie_valid() {
        // given
        given(jwtProperties.accessTokenExpiration()).willReturn(Duration.ofHours(1));
        given(exenceProperties.secureCookie()).willReturn(false);

        // when
        ResponseCookie cookie = service.createAccessTokenCookie("accessToken123");

        // then
        assertThat(cookie.getName()).isEqualTo("access_token");
        assertThat(cookie.getValue()).isEqualTo("accessToken123");
        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.getMaxAge()).isEqualTo(Duration.ofHours(1));
    }

    @Test
    @DisplayName("create refresh token cookie valid")
    void createRefreshTokenCookie_valid() {
        // given
        given(jwtProperties.refreshTokenExpiration()).willReturn(Duration.ofDays(7));
        given(exenceProperties.secureCookie()).willReturn(false);

        // when
        ResponseCookie cookie = service.createRefreshTokenCookie("refreshToken456");

        // then
        assertThat(cookie.getName()).isEqualTo("refresh_token");
        assertThat(cookie.getValue()).isEqualTo("refreshToken456");
        assertThat(cookie.getMaxAge()).isEqualTo(Duration.ofDays(7));
    }

    @Test
    @DisplayName("create expired access token cookie")
    void createExpiredAccessTokenCookie_valid() {
        // given
        given(exenceProperties.secureCookie()).willReturn(false);

        // when
        ResponseCookie cookie = service.createExpiredAccessTokenCookie();

        // then
        assertThat(cookie.getName()).isEqualTo("access_token");
        assertThat(cookie.getMaxAge()).isEqualTo(Duration.ZERO);
    }

    @Test
    @DisplayName("create expired refresh token cookie")
    void createExpiredRefreshTokenCookie_valid() {
        // given
        given(exenceProperties.secureCookie()).willReturn(false);

        // when
        ResponseCookie cookie = service.createExpiredRefreshTokenCookie();

        // then
        assertThat(cookie.getName()).isEqualTo("refresh_token");
        assertThat(cookie.getMaxAge()).isEqualTo(Duration.ZERO);
    }

    @Test
    @DisplayName("extract access token from cookie valid")
    void extractAccessTokenFromCookie_valid() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("access_token", "myAccessToken"));

        // when
        String result = service.extractAccessTokenFromCookie(request);

        // then
        assertThat(result).isEqualTo("myAccessToken");
    }

    @Test
    @DisplayName("extract access token from cookie no cookies")
    void extractAccessTokenFromCookie_noCookies() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();

        // when
        String result = service.extractAccessTokenFromCookie(request);

        // then
        assertThat(result).isNull();
    }

    @Test
    @DisplayName("extract refresh token from cookie valid")
    void extractRefreshTokenFromCookie_valid() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("refresh_token", "myRefreshToken"));

        // when
        String result = service.extractRefreshTokenFromCookie(request);

        // then
        assertThat(result).isEqualTo("myRefreshToken");
    }

    @Test
    @DisplayName("extract access token from cookie wrong cookie name")
    void extractAccessTokenFromCookie_wrongCookieName() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setCookies(new Cookie("other_cookie", "someValue"));

        // when
        String result = service.extractAccessTokenFromCookie(request);

        // then
        assertThat(result).isNull();
    }
}
