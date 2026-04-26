package com.exence.finance.modules.statistics.service.provider.goal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.exence.finance.common.exception.ExenceException;
import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.repository.GoalProgressRepository;
import com.exence.finance.modules.goal.service.GoalService;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetSetting;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GoalProgressTrendProviderTest {

    @Mock
    private GoalService goalService;

    @Mock
    private GoalProgressRepository goalProgressRepository;

    @InjectMocks
    private GoalProgressTrendProvider provider;

    @Test
    @DisplayName("returns GOAL_PROGRESS_TREND as the supported widget type")
    void getSupportedType_returnsGoalProgressTrend() {
        assertThat(provider.getSupportedType()).isEqualTo(GoalWidgetType.GOAL_PROGRESS_TREND);
    }

    @Test
    @DisplayName("returns series payload with goal name when a valid goal ID is provided")
    void getData_withGoalId() {
        // given
        WidgetRequest request = new WidgetRequest(
                LocalDate.of(2025, 1, 1),
                LocalDate.of(2025, 12, 31),
                Timeframe.ALL_TIME,
                Map.of(WidgetSetting.GOAL_ID, 1));
        Goal goal = mock(Goal.class);
        Category category = mock(Category.class);
        given(goal.getCreatedAt()).willReturn(Instant.parse("2025-01-01T00:00:00Z"));
        given(goal.getTitle()).willReturn("Vacation");
        given(goal.getCategory()).willReturn(category);
        given(category.getColor()).willReturn("#FF0000");
        given(goalService.getGoal(1L)).willReturn(goal);
        given(goalProgressRepository.findByGoalIdOrderByRecordedAt(1L)).willReturn(List.of());

        // when
        SeriesPayload result = provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(GoalWidgetType.GOAL_PROGRESS_TREND);
        assertThat(result.series()).hasSize(1);
        assertThat(result.series().getFirst().name()).isEqualTo("Vacation");
    }

    @Test
    @DisplayName("throws ExenceException when goal ID setting is missing")
    void getData_withMissingGoalId() {
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, null);

        assertThatThrownBy(() -> provider.getData(request)).isInstanceOf(ExenceException.class);
    }
}
