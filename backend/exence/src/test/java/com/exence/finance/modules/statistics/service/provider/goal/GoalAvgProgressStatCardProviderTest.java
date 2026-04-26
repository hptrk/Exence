package com.exence.finance.modules.statistics.service.provider.goal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
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
class GoalAvgProgressStatCardProviderTest {

    @Mock
    private GoalRepository goalRepository;

    @InjectMocks
    private GoalAvgProgressStatCardProvider provider;

    @Test
    @DisplayName("returns GOAL_AVG_PROGRESS_STATCARD as the supported widget type")
    void getSupportedType_returnsGoalAvgProgressStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(GoalWidgetType.GOAL_AVG_PROGRESS_STATCARD);
    }

    @Test
    @DisplayName("returns zero when no active goals exist")
    void getData_withNoGoals() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(goalRepository.findByStatusIn(any())).willReturn(List.of());

        // when
        StatCardPayload result = provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(GoalWidgetType.GOAL_AVG_PROGRESS_STATCARD);
        assertThat(result.value()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("returns average progress percentage when active goals exist")
    void getData_withGoals() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        Goal goal = mock(Goal.class);
        given(goal.getCurrentAmount()).willReturn(new BigDecimal("500"));
        given(goal.getTargetAmount()).willReturn(new BigDecimal("1000"));
        given(goalRepository.findByStatusIn(any())).willReturn(List.of(goal));

        // when
        StatCardPayload result = provider.getData(request);

        // then
        assertThat(result.value()).isEqualByComparingTo(new BigDecimal("50.00"));
        assertThat(result.unit()).isEqualTo("%");
    }
}
