package com.exence.finance.modules.achievement.checker;

import com.exence.finance.modules.achievement.enums.AchievementType;

public interface AchievementChecker {

    AchievementType getSupportedType();

    long computeCurrentValue(Long workspaceId);
}
