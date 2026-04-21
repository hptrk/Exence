package com.exence.finance.integration.actors;

import com.exence.finance.integration.setup.AuthContext;
import com.exence.finance.modules.achievement.dto.AchievementGetDTO;
import com.exence.finance.modules.achievement.dto.WorkspaceAchievementGetDTO;
import io.restassured.config.RestAssuredConfig;
import java.util.List;

/**
 * Domain DSL for achievement operations.
 *
 * <p>Encapsulates RestAssured calls for: listing all defined achievements
 * and listing unlocked achievements for the current workspace.
 */
public class AchievementActor extends BaseActor {

    public AchievementActor(RestAssuredConfig config) {
        super(config);
    }

    /** Returns all defined achievements (regardless of unlock status). */
    public List<AchievementGetDTO> listAll(AuthContext ctx) {
        AchievementGetDTO[] result = inWorkspace(ctx)
                .when()
                .get("/achievements")
                .then()
                .statusCode(200)
                .extract()
                .as(AchievementGetDTO[].class);
        return List.of(result);
    }

    /** Returns achievements unlocked by the current workspace. */
    public List<WorkspaceAchievementGetDTO> listUnlocked(AuthContext ctx) {
        WorkspaceAchievementGetDTO[] result = inWorkspace(ctx)
                .when()
                .get("/achievements/unlocked")
                .then()
                .statusCode(200)
                .extract()
                .as(WorkspaceAchievementGetDTO[].class);
        return List.of(result);
    }
}
