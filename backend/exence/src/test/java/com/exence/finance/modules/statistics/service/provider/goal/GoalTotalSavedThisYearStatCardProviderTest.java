package com.exence.finance.modules.statistics.service.provider.goal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.ProviderHelper;
import com.exence.finance.modules.statistics.service.provider.TrendResult;
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
class GoalTotalSavedThisYearStatCardProviderTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private ProviderHelper providerHelper;

    @InjectMocks
    private GoalTotalSavedThisYearStatCardProvider provider;

    @Test
    @DisplayName("returns GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD as the supported widget type")
    void getSupportedType_returnsGoalTotalSavedThisYearStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(GoalWidgetType.GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD);
    }

    @Test
    @DisplayName("returns zero stat card with currency symbol when no goals exist")
    void getData_withNoGoals() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(goalRepository.findAllWorkspaceFiltered()).willReturn(List.of());
        given(providerHelper.computeTrendByDifference(any(), any(), any())).willReturn(TrendResult.NEUTRAL);
        given(providerHelper.getUserCurrencySymbol()).willReturn("€");

        // when
        StatCardPayload result = provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(GoalWidgetType.GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD);
        assertThat(result.value()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.unit()).isEqualTo("€");
    }
}
