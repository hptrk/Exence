package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.DailyTrendResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExpenseTrendProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private ExpenseTrendProvider provider;

    @Test
    @DisplayName("returns EXPENSE_TREND as the supported widget type")
    void getSupportedType_returnsExpenseTrend() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.EXPENSE_TREND);
    }

    @Test
    @DisplayName("returns series payload with data points when results exist")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findDailyTrendByType(any()))
                .willReturn(List.of(new DailyTrendResult(LocalDate.of(2025, 1, 10), new BigDecimal("100"))));
        given(i18n.get("label.expense")).willReturn("Expense");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.EXPENSE_TREND);
        assertThat(result.series()).hasSize(1);
        assertThat(result.series().getFirst().data()).hasSize(1);
    }

    @Test
    @DisplayName("returns empty series when no data is available")
    void getData_withEmptyResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findDailyTrendByType(any())).willReturn(List.of());
        given(i18n.get("label.expense")).willReturn("Expense");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.EXPENSE_TREND);
        assertThat(result.series().getFirst().data()).isEmpty();
    }
}
