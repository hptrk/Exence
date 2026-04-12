package com.exence.finance.modules.achievement.checker.impl;

import com.exence.finance.common.annotations.transaction.ReadTransactional;
import com.exence.finance.modules.achievement.checker.AchievementChecker;
import com.exence.finance.modules.achievement.enums.AchievementType;
import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.goal.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GoalCompletedChecker implements AchievementChecker {

    private final GoalRepository goalRepository;

    @Override
    public AchievementType getSupportedType() {
        return AchievementType.GOAL_COMPLETED;
    }

    @Override
    @ReadTransactional
    public long computeCurrentValue(Long workspaceId) {
        return goalRepository.countByWorkspaceIdAndStatus(workspaceId, GoalStatus.COMPLETED);
    }
}
