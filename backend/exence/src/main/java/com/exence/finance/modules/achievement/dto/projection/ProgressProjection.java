package com.exence.finance.modules.achievement.dto.projection;

import com.exence.finance.modules.achievement.enums.AchievementType;

public record ProgressProjection(AchievementType type, Long currentValue) {}
