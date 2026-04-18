package com.exence.finance.modules.statistics.service.provider.goal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.goal.enums.GoalStatus;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GoalCompletionRateStatCardProviderTest {

    @Mock
    private GoalRepository goalRepository;

    @InjectMocks
    private GoalCompletionRateStatCardProvider provider;

    @Test
    @DisplayName("returns GOAL_COMPLETION_RATE_STATCARD as the supported widget type")
    void getSupportedType_returnsGoalCompletionRateStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(GoalWidgetType.GOAL_COMPLETION_RATE_STATCARD);
    }

    @Test
    @DisplayName("returns zero completion rate when no goals exist")
    void getData_withNoGoals() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(goalRepository.countByStatus(GoalStatus.COMPLETED)).willReturn(0L);
        given(goalRepository.countAll()).willReturn(0L);

        // when
        StatCardPayload result = provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(GoalWidgetType.GOAL_COMPLETION_RATE_STATCARD);
        assertThat(result.value()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("returns correct completion rate percentage when goals exist")
    void getData_withGoals() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(goalRepository.countByStatus(GoalStatus.COMPLETED)).willReturn(2L);
        given(goalRepository.countAll()).willReturn(4L);

        // when
        StatCardPayload result = provider.getData(request);

        // then
        assertThat(result.value()).isEqualByComparingTo(new BigDecimal("50.00"));
        assertThat(result.unit()).isEqualTo("%");
    }
}
