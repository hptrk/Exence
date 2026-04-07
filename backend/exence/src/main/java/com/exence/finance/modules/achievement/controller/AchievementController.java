package com.exence.finance.modules.achievement.controller;

import com.exence.finance.modules.achievement.dto.AchievementGetDTO;
import com.exence.finance.modules.achievement.dto.UserAchievementGetDTO;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface AchievementController {

    ResponseEntity<List<AchievementGetDTO>> getAllAchievements();

    ResponseEntity<List<UserAchievementGetDTO>> getUnlockedAchievements();
}
