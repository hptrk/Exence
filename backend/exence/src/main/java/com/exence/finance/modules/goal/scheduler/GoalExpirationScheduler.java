package com.exence.finance.modules.goal.scheduler;

import com.exence.finance.modules.goal.service.GoalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class GoalExpirationScheduler {

    private final GoalService goalService;

    @Scheduled(cron = "${exence.goals.check-expired-cron}")
    public void expireOverdueGoals() {
        log.info("Goal expiration job started");
        int expired = goalService.expireOverdueGoals();
        log.info("Goal expiration job completed - goals expired: {}", expired);
    }
}
