package com.exence.finance.security;

import com.exence.finance.modules.auth.dto.TokenType;
import com.exence.finance.modules.auth.service.CookieService;
import com.exence.finance.modules.auth.service.TokenValidationService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

// This class is a filter class, runs before every http request, checks if the request has a valid ACCESS JWT token, and
// sets the security context if the token is valid
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenValidationService tokenValidationService;
    private final CookieService cookieService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        if (isAuthenticationPath(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = cookieService.extractAccessTokenFromCookie(request);
        if (jwt == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            authenticateRequest(request, jwt);
        } catch (ExpiredJwtException ex) {
            request.setAttribute("expired-jwt-exception", ex);
        } catch (Exception ex) {
            request.setAttribute("jwt-processing-exception", ex);
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAuthenticationPath(HttpServletRequest request) {
        return request.getServletPath().contains("/auth");
    }

    private void authenticateRequest(HttpServletRequest request, String jwt) {
        if (!jwtService.isTokenOfType(jwt, TokenType.ACCESS)) {
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            return;
        }

        String userEmail = jwtService.extractUsername(jwt);
        if (userEmail == null) {
            return;
        }

        if (!tokenValidationService.isTokenValid(jwt, TokenType.ACCESS)) {
            return;
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
        setAuthentication(request, userDetails);
    }

    private void setAuthentication(HttpServletRequest request, UserDetails userDetails) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
