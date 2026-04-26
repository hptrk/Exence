package com.exence.finance.modules.achievement.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.exence.finance.common.BaseControllerTest;
import com.exence.finance.modules.achievement.controller.impl.AchievementControllerImpl;
import com.exence.finance.modules.achievement.dto.AchievementGetDTO;
import com.exence.finance.modules.achievement.dto.WorkspaceAchievementGetDTO;
import com.exence.finance.modules.achievement.enums.AchievementTier;
import com.exence.finance.modules.achievement.enums.AchievementType;
import com.exence.finance.modules.achievement.service.AchievementService;
import com.fasterxml.jackson.core.type.TypeReference;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(AchievementControllerImpl.class)
class AchievementControllerTest extends BaseControllerTest {

    @MockitoBean
    private AchievementService achievementService;

    // --- GET /api/achievements ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/achievements - returns all achievements")
    void getAllAchievements() throws Exception {
        // given
        AchievementGetDTO dto = new AchievementGetDTO(
                1L,
                "First Investment",
                "Complete your first investment",
                AchievementTier.BRONZE,
                AchievementType.TRANSACTION_COUNT,
                1L,
                0L,
                false,
                null);
        given(achievementService.getAllAchievements()).willReturn(List.of(dto));

        // when
        ResultActions result = performGet("/api/achievements");

        // then
        result.andExpect(status().isOk());
        List<AchievementGetDTO> body = fromJson(result, new TypeReference<>() {});
        assertThat(body).hasSize(1);
        assertThat(body.getFirst().name()).isEqualTo("First Investment");
    }

    @Test
    @DisplayName("GET /api/achievements - 401 when unauthenticated")
    void getAllAchievements_unauthenticated_returns401() throws Exception {
        performGet("/api/achievements").andExpect(status().isUnauthorized());
    }

    // --- GET /api/achievements/unlocked ---

    @Test
    @WithMockUser
    @DisplayName("GET /api/achievements/unlocked - returns unlocked workspace achievements")
    void getUnlockedAchievements() throws Exception {
        // given
        WorkspaceAchievementGetDTO dto = new WorkspaceAchievementGetDTO(
                1L,
                1L,
                "First Investment",
                "Complete your first investment",
                AchievementTier.BRONZE,
                AchievementType.TRANSACTION_COUNT,
                1L,
                Instant.now());
        given(achievementService.getUnlockedAchievements()).willReturn(List.of(dto));

        // when
        ResultActions result = performGet("/api/achievements/unlocked");

        // then
        result.andExpect(status().isOk());
        List<WorkspaceAchievementGetDTO> body = fromJson(result, new TypeReference<>() {});
        assertThat(body).hasSize(1);
        assertThat(body.getFirst().name()).isEqualTo("First Investment");
    }
}
