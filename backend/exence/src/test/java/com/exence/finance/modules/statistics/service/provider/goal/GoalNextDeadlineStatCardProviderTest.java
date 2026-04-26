package com.exence.finance.modules.statistics.service.provider.goal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.goal.entity.Goal;
import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GoalNextDeadlineStatCardProviderTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private I18nService i18n;

    @InjectMocks
    private GoalNextDeadlineStatCardProvider provider;

    @Test
    @DisplayName("returns GOAL_NEXT_DEADLINE_STATCARD as the supported widget type")
    void getSupportedType_returnsGoalNextDeadlineStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(GoalWidgetType.GOAL_NEXT_DEADLINE_STATCARD);
    }

    @Test
    @DisplayName("returns null value with fallback label when no upcoming goal deadline exists")
    void getData_withNoGoal() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(goalRepository.findNextDeadlineGoal(any(), any())).willReturn(Optional.empty());
        given(i18n.get("unit.days")).willReturn("days");
        given(i18n.get("context.no-deadline")).willReturn("No deadline");

        // when
        StatCardPayload result = provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(GoalWidgetType.GOAL_NEXT_DEADLINE_STATCARD);
        assertThat(result.value()).isNull();
        assertThat(result.contextLabel()).isEqualTo("No deadline");
    }

    @Test
    @DisplayName("returns days until deadline and goal title when an upcoming goal exists")
    void getData_withGoal() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        Goal goal = mock(Goal.class);
        given(goal.getDeadline()).willReturn(LocalDate.now().plusDays(10));
        given(goal.getTitle()).willReturn("Save for vacation");
        given(goalRepository.findNextDeadlineGoal(any(), any())).willReturn(Optional.of(goal));
        given(i18n.getUnitLabel(anyLong(), anyString(), anyString())).willReturn("days");

        // when
        StatCardPayload result = provider.getData(request);

        // then
        assertThat(result.contextLabel()).isEqualTo("Save for vacation");
        assertThat(result.unit()).isEqualTo("days");
    }
}
