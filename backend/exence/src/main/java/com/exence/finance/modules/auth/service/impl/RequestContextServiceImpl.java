package com.exence.finance.modules.auth.service.impl;

import com.exence.finance.modules.auth.service.RequestContextService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@Slf4j
public class RequestContextServiceImpl implements RequestContextService {

    @Override
    public String extractUserAgent() {
        try {
            HttpServletRequest request = getCurrentRequest();
            if (request != null) {
                return request.getHeader("User-Agent");
            }
        } catch (Exception e) {
            log.debug("Could not extract user agent: {}", e.getMessage());
        }
        return "Unknown";
    }

    @Override
    public String extractIpAddress() {
        try {
            HttpServletRequest request = getCurrentRequest();
            if (request != null) {
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            log.debug("Could not extract IP address: {}", e.getMessage());
        }
        return "Unknown";
    }

    @Override
    public String extractAuthorizationHeader() {
        try {
            HttpServletRequest request = getCurrentRequest();
            if (request != null) {
                return request.getHeader("Authorization");
            }
        } catch (Exception e) {
            log.debug("Could not extract authorization header: {}", e.getMessage());
        }
        return null;
    }

    @Override
    public String extractBearerToken() {
        String authHeader = extractAuthorizationHeader();
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes != null ? attributes.getRequest() : null;
    }
}