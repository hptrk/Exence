package com.exence.finance.modules.achievement.service;

import com.exence.finance.modules.achievement.dto.AchievementGetDTO;
import com.exence.finance.modules.achievement.dto.UserAchievementGetDTO;
import com.exence.finance.modules.achievement.enums.AchievementType;
import java.util.List;

public interface AchievementService {

    List<AchievementGetDTO> getAllAchievements();

    List<UserAchievementGetDTO> getUnlockedAchievements();

    void processAchievement(Long userId, AchievementType type);
}
