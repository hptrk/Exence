package com.exence.finance.security;

import com.exence.finance.config.properties.EmailBusinessProperties;
import com.exence.finance.modules.auth.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class EmailVerificationInterceptor implements HandlerInterceptor {
    private final ObjectMapper objectMapper;
    private final EmailBusinessProperties emailBusinessProperties;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String requestPath = request.getRequestURI();

        List<String> requiredPaths = emailBusinessProperties.getVerificationRequiredPaths();
        if (requiredPaths == null || requiredPaths.isEmpty()) {
            return true;
        }

        boolean requiresVerification = requiredPaths.stream().anyMatch(requestPath::startsWith);

        if (!requiresVerification) {
            return true;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            if (!user.getEmailVerified()) {
                writeEmailVerificationRequiredResponse(response);
                return false;
            }
        }

        return true;
    }

    private void writeEmailVerificationRequiredResponse(HttpServletResponse response) throws Exception {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", "EMAIL_VERIFICATION_REQUIRED");
        errorResponse.put("message", "Please verify your email address to access this feature");
        errorResponse.put("timestamp", System.currentTimeMillis());
        errorResponse.put("requiredAction", "VERIFY_EMAIL");

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
