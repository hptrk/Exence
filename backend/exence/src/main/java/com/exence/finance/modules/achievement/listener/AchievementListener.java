package com.exence.finance.modules.achievement.listener;

import static com.exence.finance.modules.achievement.enums.AchievementType.APP_STREAK;
import static com.exence.finance.modules.achievement.enums.AchievementType.DEBT_COUNT;
import static com.exence.finance.modules.achievement.enums.AchievementType.DEBT_SETTLED;
import static com.exence.finance.modules.achievement.enums.AchievementType.GOAL_COMPLETED;
import static com.exence.finance.modules.achievement.enums.AchievementType.GOAL_COUNT;
import static com.exence.finance.modules.achievement.enums.AchievementType.TRANSACTION_COUNT;

import com.exence.finance.modules.achievement.service.AchievementService;
import com.exence.finance.modules.debt.event.DebtCreatedEvent;
import com.exence.finance.modules.debt.event.DebtSettledEvent;
import com.exence.finance.modules.goal.event.GoalCompletedEvent;
import com.exence.finance.modules.goal.event.GoalCreatedEvent;
import com.exence.finance.modules.transaction.event.TransactionCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class AchievementListener {

    private final AchievementService achievementService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onTransactionCreated(TransactionCreatedEvent event) {
        log.debug("Processing achievements for TRANSACTION_COUNT and APP_STREAK, userId={}", event.userId());
        achievementService.processAchievement(event.userId(), TRANSACTION_COUNT);
        achievementService.processAchievement(event.userId(), APP_STREAK);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onGoalCreated(GoalCreatedEvent event) {
        log.debug("Processing achievements for GOAL_COUNT, userId={}", event.userId());
        achievementService.processAchievement(event.userId(), GOAL_COUNT);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onGoalCompleted(GoalCompletedEvent event) {
        log.debug("Processing achievements for GOAL_COMPLETED, userId={}", event.userId());
        achievementService.processAchievement(event.userId(), GOAL_COMPLETED);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDebtCreated(DebtCreatedEvent event) {
        log.debug("Processing achievements for DEBT_COUNT, userId={}", event.userId());
        achievementService.processAchievement(event.userId(), DEBT_COUNT);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDebtSettled(DebtSettledEvent event) {
        log.debug("Processing achievements for DEBT_SETTLED, userId={}", event.userId());
        achievementService.processAchievement(event.userId(), DEBT_SETTLED);
    }
}
