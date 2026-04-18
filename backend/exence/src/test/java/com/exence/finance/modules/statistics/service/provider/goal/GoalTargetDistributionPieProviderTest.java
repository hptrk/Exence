package com.exence.finance.modules.statistics.service.provider.goal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.exence.finance.modules.category.entity.Category;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import java.math.BigDecimal;
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
class GoalTargetDistributionPieProviderTest {

    @Mock
    private GoalRepository goalRepository;

    @InjectMocks
    private GoalTargetDistributionPieProvider provider;

    @Test
    @DisplayName("returns GOAL_TARGET_DISTRIBUTION_PIE as the supported widget type")
    void getSupportedType_returnsGoalTargetDistributionPie() {
        assertThat(provider.getSupportedType()).isEqualTo(GoalWidgetType.GOAL_TARGET_DISTRIBUTION_PIE);
    }

    @Test
    @DisplayName("returns distribution payload with goal entries when goals exist")
    void getData_withGoals() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        Goal goal = mock(Goal.class);
        Category category = mock(Category.class);
        given(goal.getTitle()).willReturn("Vacation");
        given(goal.getTargetBaseCurrencyAmount()).willReturn(new BigDecimal("5000"));
        given(goal.getCategory()).willReturn(category);
        given(category.getColor()).willReturn("#FF0000");
        given(goalRepository.findByStatusIn(any())).willReturn(List.of(goal));

        // when
        DistributionPayload result = provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(GoalWidgetType.GOAL_TARGET_DISTRIBUTION_PIE);
        assertThat(result.data()).hasSize(1);
        assertThat(result.data().getFirst().name()).isEqualTo("Vacation");
    }

    @Test
    @DisplayName("returns empty distribution when no goals exist")
    void getData_withNoGoals() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(goalRepository.findByStatusIn(any())).willReturn(List.of());

        // when
        DistributionPayload result = provider.getData(request);

        // then
        assertThat(result.data()).isEmpty();
    }
}
