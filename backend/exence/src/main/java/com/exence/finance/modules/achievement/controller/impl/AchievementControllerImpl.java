package com.exence.finance.modules.achievement.controller.impl;

import com.exence.finance.common.util.ResponseFactory;
import com.exence.finance.modules.achievement.controller.AchievementController;
import com.exence.finance.modules.achievement.dto.AchievementGetDTO;
import com.exence.finance.modules.achievement.dto.WorkspaceAchievementGetDTO;
import com.exence.finance.modules.achievement.service.AchievementService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AchievementControllerImpl implements AchievementController {

    private final AchievementService achievementService;

    @GetMapping
    public ResponseEntity<List<AchievementGetDTO>> getAllAchievements() {
        return ResponseFactory.ok(achievementService.getAllAchievements());
    }

    @GetMapping("/unlocked")
    public ResponseEntity<List<WorkspaceAchievementGetDTO>> getUnlockedAchievements() {
        return ResponseFactory.ok(achievementService.getUnlockedAchievements());
    }
}
