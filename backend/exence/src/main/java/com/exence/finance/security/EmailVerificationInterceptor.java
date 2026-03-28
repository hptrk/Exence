package com.exence.finance.security;

import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.config.properties.EmailBusinessProperties;
import com.exence.finance.modules.auth.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class EmailVerificationInterceptor implements HandlerInterceptor {
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
                throw new ExenceException(ErrorCode.EMAIL_VERIFICATION_REQUIRED);
            }
        }

        return true;
    }
}
