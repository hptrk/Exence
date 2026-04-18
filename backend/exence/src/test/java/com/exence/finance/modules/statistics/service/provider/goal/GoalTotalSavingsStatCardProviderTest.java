package com.exence.finance.modules.statistics.service.provider.goal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.goal.repository.GoalRepository;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.goal.GoalWidgetType;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.service.provider.ProviderHelper;
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
class GoalTotalSavingsStatCardProviderTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private ProviderHelper providerHelper;

    @InjectMocks
    private GoalTotalSavingsStatCardProvider provider;

    @Test
    @DisplayName("returns GOAL_TOTAL_SAVINGS_STATCARD as the supported widget type")
    void getSupportedType_returnsGoalTotalSavingsStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(GoalWidgetType.GOAL_TOTAL_SAVINGS_STATCARD);
    }

    @Test
    @DisplayName("returns sum of current base currency amounts across all goals")
    void getData_returnsTotalSavings() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(goalRepository.sumCurrentBaseCurrencyAmount()).willReturn(new BigDecimal("12500.00"));
        given(providerHelper.getUserCurrencySymbol()).willReturn("€");

        // when
        StatCardPayload result = provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(GoalWidgetType.GOAL_TOTAL_SAVINGS_STATCARD);
        assertThat(result.value()).isEqualByComparingTo(new BigDecimal("12500.00"));
        assertThat(result.unit()).isEqualTo("€");
    }
}
