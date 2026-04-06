package com.exence.finance.modules.debt.scheduler;

import com.exence.finance.modules.debt.service.DebtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DebtExpirationScheduler {

    private final DebtService debtService;

    @Scheduled(cron = "${exence.debts.check-expired-cron}")
    public void expireOverdueDebts() {
        log.info("Debt expiration job started");
        int expired = debtService.expireOverdueDebts();
        log.info("Debt expiration job completed - debts expired: {}", expired);
    }
}
