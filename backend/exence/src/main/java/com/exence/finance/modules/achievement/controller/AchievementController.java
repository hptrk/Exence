package com.exence.finance.modules.achievement.controller;

import com.exence.finance.common.annotations.ExenceOpenApi;
import com.exence.finance.common.exception.ErrorCode;
import com.exence.finance.modules.achievement.dto.AchievementGetDTO;
import com.exence.finance.modules.achievement.dto.WorkspaceAchievementGetDTO;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;

@Tag(name = "Achievements", description = "Achievement catalogue and unlocked achievement tracking")
public interface AchievementController {

    @ExenceOpenApi(
            summary = "List all achievements",
            description = "Returns the full catalogue of all achievements defined in the system, including their name,"
                    + " description, and unlock criteria. This list does not indicate which achievements"
                    + " the current user has unlocked.",
            successStatus = 200,
            successDescription = "List of all achievements returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<List<AchievementGetDTO>> getAllAchievements();

    @ExenceOpenApi(
            summary = "List unlocked achievements",
            description =
                    "Returns all achievements which were unlocked in the current workspace, along with the timestamp"
                            + " at which each achievement was earned.",
            successStatus = 200,
            successDescription = "List of unlocked achievements for the current workspace returned.",
            errors = {ErrorCode.AUTHENTICATION_FAILED})
    ResponseEntity<List<WorkspaceAchievementGetDTO>> getUnlockedAchievements();
}
