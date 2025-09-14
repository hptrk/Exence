package com.exence.finance.security;

import com.exence.finance.common.exception.AuthenticationFailedException;
import com.exence.finance.common.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.ServletWebRequest;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final GlobalExceptionHandler globalExceptionHandler;
    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(GlobalExceptionHandler globalExceptionHandler, ObjectMapper objectMapper) {
        this.globalExceptionHandler = globalExceptionHandler;
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {

        ServletWebRequest webRequest = new ServletWebRequest(request, response);
        ResponseEntity<ProblemDetail> responseEntity;

        // check for ExpiredJwtException in request attributes
        ExpiredJwtException expiredJwtException = (ExpiredJwtException) request.getAttribute("expired-jwt-exception");

        if (expiredJwtException != null) {
            // delegate to GlobalExceptionHandler for expired JWT
            responseEntity = globalExceptionHandler.handleExpiredJwtException(expiredJwtException, webRequest);
        } else {
            // check for other JWT processing exceptions
            Exception jwtProcessingException = (Exception) request.getAttribute("jwt-processing-exception");

            if (jwtProcessingException != null) {
                // delegate to GlobalExceptionHandler for authentication failure
                responseEntity = globalExceptionHandler.handleAuthenticationFailedException(
                        new AuthenticationFailedException("JWT processing failed: " + jwtProcessingException.getMessage()),
                        webRequest);
            } else {
                responseEntity = globalExceptionHandler.handleAuthenticationFailedException(
                        new AuthenticationFailedException(authException.getMessage()),
                        webRequest);
            }
        }

        response.setStatus(responseEntity.getStatusCode().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(responseEntity.getBody()));
    }
}