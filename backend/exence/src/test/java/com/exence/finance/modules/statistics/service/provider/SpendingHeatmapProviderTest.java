package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.HeatmapResult;
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
class SpendingHeatmapProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private I18nService i18n;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private SpendingHeatmapProvider provider;

    @Test
    @DisplayName("returns SPENDING_HEATMAP as the supported widget type")
    void getSupportedType_returnsSpendingHeatmap() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.SPENDING_HEATMAP);
    }

    @Test
    @DisplayName("returns seven series representing days of the week when results exist")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.YTD, Map.of());
        given(statisticsQueryService.findWeeklyHeatmapExpense(any()))
                .willReturn(List.of(new HeatmapResult(1, 1, new BigDecimal("50"))));
        given(i18n.getDayName(anyInt())).willReturn("Mon");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.SPENDING_HEATMAP);
        assertThat(result.series()).hasSize(7);
    }

    @Test
    @DisplayName("returns seven series with zero data points when no data is available")
    void getData_withEmptyResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.YTD, Map.of());
        given(statisticsQueryService.findWeeklyHeatmapExpense(any())).willReturn(List.of());
        given(i18n.getDayName(anyInt())).willReturn("Day");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.series()).hasSize(7);
    }
}
