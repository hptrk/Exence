package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
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
class ExpenseCategoryTrendProviderTest {

    @Mock
    private ProviderHelper providerHelper;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private ExpenseCategoryTrendProvider provider;

    @Test
    @DisplayName("returns EXPENSE_CATEGORY_TREND as the supported widget type")
    void getSupportedType_returnsExpenseCategoryTrend() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.EXPENSE_CATEGORY_TREND);
    }

    @Test
    @DisplayName("returns series payload delegated from provider helper")
    void getData_withResults() {
        // given
        WidgetRequest request = new WidgetRequest(
                LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS, Map.of());
        SeriesPayload expected = new SeriesPayload(StatisticsWidgetType.EXPENSE_CATEGORY_TREND, List.of());
        given(statisticsQueryService.findMonthlyCategoryTotals(any())).willReturn(List.of());
        given(providerHelper.buildMonthlyCategorySeriesPayload(any(), any(), any(), any(), any()))
                .willReturn(expected);

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result).isEqualTo(expected);
    }
}
