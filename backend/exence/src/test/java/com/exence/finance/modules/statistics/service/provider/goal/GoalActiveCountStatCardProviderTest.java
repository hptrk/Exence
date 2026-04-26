package com.exence.finance.modules.statistics.service.provider.goal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
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
class GoalActiveCountStatCardProviderTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private I18nService i18n;

    @InjectMocks
    private GoalActiveCountStatCardProvider provider;

    @Test
    @DisplayName("returns GOAL_ACTIVE_COUNT_STATCARD as the supported widget type")
    void getSupportedType_returnsGoalActiveCountStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD);
    }

    @Test
    @DisplayName("returns the number of active goals with the goals unit label")
    void getData_returnsActiveGoalCount() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(goalRepository.countByStatus(GoalStatus.ACTIVE)).willReturn(3L);
        given(i18n.get("label.goals")).willReturn("goals");

        // when
        StatCardPayload result = provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD);
        assertThat(result.value()).isEqualByComparingTo(BigDecimal.valueOf(3));
        assertThat(result.unit()).isEqualTo("goals");
    }
}
