package com.exence.finance.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import com.exence.finance.common.fixtures.UserTestFixtures;
import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.entity.User;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.TokenValidationService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private TokenValidationService tokenValidationService;

    @Mock
    private CookieService cookieService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("proceeds without authentication when no cookie present")
    void filter_noCookie() throws Exception {
        // given
        given(request.getServletPath()).willReturn("/api/transactions");
        given(cookieService.extractAccessTokenFromCookie(request)).willReturn(null);

        // when
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // then
        then(filterChain).should().doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    @DisplayName("sets security context when token is valid")
    void filter_validToken() throws Exception {
        // given
        User user = UserTestFixtures.defaultUser();
        String token = "valid.jwt.token";

        given(request.getServletPath()).willReturn("/api/transactions");
        given(cookieService.extractAccessTokenFromCookie(request)).willReturn(token);
        given(jwtService.isTokenOfType(token, TokenType.ACCESS)).willReturn(true);
        given(jwtService.extractUsername(token)).willReturn(user.getEmail());
        given(tokenValidationService.isTokenValid(token, TokenType.ACCESS)).willReturn(true);
        given(userDetailsService.loadUserByUsername(user.getEmail())).willReturn(user);

        // when
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // then
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .isEqualTo(user);
        then(filterChain).should().doFilter(request, response);
    }

    @Test
    @DisplayName("sets error attribute and proceeds when token is expired")
    void filter_expiredToken() throws Exception {
        // given
        String token = "expired.jwt.token";

        given(request.getServletPath()).willReturn("/api/transactions");
        given(cookieService.extractAccessTokenFromCookie(request)).willReturn(token);
        given(jwtService.isTokenOfType(token, TokenType.ACCESS)).willReturn(true);
        given(jwtService.extractUsername(token)).willThrow(new ExpiredJwtException(null, null, "expired"));

        // when
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // then
        then(request).should().setAttribute(eq("expired-jwt-exception"), any(ExpiredJwtException.class));
        then(filterChain).should().doFilter(request, response);
    }

    @Test
    @DisplayName("skips authentication for auth paths")
    void filter_authPath() throws Exception {
        // given
        given(request.getServletPath()).willReturn("/api/auth/login");

        // when
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // then
        then(cookieService).shouldHaveNoInteractions();
        then(filterChain).should().doFilter(request, response);
    }

    @Test
    @DisplayName("does not set context when token type is not ACCESS")
    void filter_wrongTokenType() throws Exception {
        // given
        String token = "refresh.jwt.token";

        given(request.getServletPath()).willReturn("/api/transactions");
        given(cookieService.extractAccessTokenFromCookie(request)).willReturn(token);
        given(jwtService.isTokenOfType(token, TokenType.ACCESS)).willReturn(false);

        // when
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // then
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        then(userDetailsService).should(never()).loadUserByUsername(any());
        then(filterChain).should().doFilter(request, response);
    }

    @Test
    @DisplayName("does not set context when token is invalid in repository")
    void filter_invalidToken() throws Exception {
        // given
        User user = UserTestFixtures.defaultUser();
        String token = "revoked.jwt.token";

        given(request.getServletPath()).willReturn("/api/transactions");
        given(cookieService.extractAccessTokenFromCookie(request)).willReturn(token);
        given(jwtService.isTokenOfType(token, TokenType.ACCESS)).willReturn(true);
        given(jwtService.extractUsername(token)).willReturn(user.getEmail());
        given(tokenValidationService.isTokenValid(token, TokenType.ACCESS)).willReturn(false);

        // when
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // then
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        then(userDetailsService).should(never()).loadUserByUsername(any());
        then(filterChain).should().doFilter(request, response);
    }

    @Test
    @DisplayName("sets error attribute and proceeds when unexpected exception occurs")
    void filter_unexpectedException() throws Exception {
        // given
        String token = "malformed.jwt.token";

        given(request.getServletPath()).willReturn("/api/transactions");
        given(cookieService.extractAccessTokenFromCookie(request)).willReturn(token);
        given(jwtService.isTokenOfType(token, TokenType.ACCESS)).willThrow(new RuntimeException("parse error"));

        // when
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // then
        then(request).should().setAttribute(eq("jwt-processing-exception"), any(RuntimeException.class));
        then(filterChain).should().doFilter(request, response);
    }
}
