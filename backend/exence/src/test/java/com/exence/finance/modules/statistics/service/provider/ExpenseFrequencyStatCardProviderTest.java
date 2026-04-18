package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExpenseFrequencyStatCardProviderTest {

    @Mock
    private ProviderHelper providerHelper;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private ExpenseFrequencyStatCardProvider provider;

    @Test
    @DisplayName("returns EXPENSE_FREQUENCY_STATCARD as the supported widget type")
    void getSupportedType_returnsExpenseFrequencyStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD);
    }

    @Test
    @DisplayName("returns stat card payload delegated from provider helper")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        StatCardPayload expected = new StatCardPayload(
                StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD, BigDecimal.TEN, null, null, null, null, null, null);
        given(statisticsQueryService.countTransactionsByType(any())).willReturn(10L);
        given(providerHelper.buildFrequencyStatCard(any(), anyLong(), any(), any()))
                .willReturn(expected);

        // when
        StatCardPayload result = (StatCardPayload) provider.getData(request);

        // then
        assertThat(result).isEqualTo(expected);
    }
}
