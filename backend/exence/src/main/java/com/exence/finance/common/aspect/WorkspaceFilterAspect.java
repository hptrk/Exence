package com.exence.finance.common.aspect;

import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class WorkspaceFilterAspect {

    @PersistenceContext
    private EntityManager entityManager;

    @SneakyThrows
    @Around("execution(* com.exence.finance.modules.*.repository.*Repository.*(..))")
    public Object enableWorkspaceFilter(ProceedingJoinPoint joinPoint) {
        if (WorkspaceContextHolder.isSet()) {
            Session hibernateSession = entityManager.unwrap(Session.class);
            hibernateSession
                    .enableFilter("workspaceFilter")
                    .setParameter("workspaceId", WorkspaceContextHolder.getWorkspaceId());
        }
        return joinPoint.proceed();
    }
}
