package com.exence.finance.common.aspect;

import com.exence.finance.modules.auth.service.UserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.hibernate.Session;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class UserFilterAspect {
    @PersistenceContext
    private EntityManager entityManager;

    private final UserService userService;

    @SneakyThrows
    @Around("execution(* com.exence.finance.modules.*.repository.*Repository.*(..))")
    public Object enableUserFilter(ProceedingJoinPoint joinPoint) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null
                && auth.isAuthenticated()
                && !"anonymousUser".equals(auth.getPrincipal().toString())) {
            Long userId = userService.getCurrentUserId();

            Session hibernateSession = entityManager.unwrap(Session.class);
            hibernateSession.enableFilter("userFilter").setParameter("userId", userId);
        }

        return joinPoint.proceed();
    }
}
