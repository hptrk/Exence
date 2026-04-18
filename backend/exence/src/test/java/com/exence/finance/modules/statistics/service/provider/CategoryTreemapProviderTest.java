package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.CategoryFlowResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
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
class CategoryTreemapProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private CategoryTreemapProvider provider;

    @Test
    @DisplayName("returns CATEGORY_TREEMAP as the supported widget type")
    void getSupportedType_returnsCategoryTreemap() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.CATEGORY_TREEMAP);
    }

    @Test
    @DisplayName("returns series payload with two series when both income and expense data exist")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findCategoryTotalsGroupedByType(any()))
                .willReturn(List.of(
                        new CategoryFlowResult(TransactionType.EXPENSE, "Food", "#FF0000", new BigDecimal("300")),
                        new CategoryFlowResult(TransactionType.INCOME, "Salary", "#00FF00", new BigDecimal("1000"))));
        given(i18n.get("label.expense")).willReturn("Expense");
        given(i18n.get("label.income")).willReturn("Income");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.CATEGORY_TREEMAP);
        assertThat(result.series()).hasSize(2);
    }

    @Test
    @DisplayName("returns two empty series when no data is available")
    void getData_withEmptyResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findCategoryTotalsGroupedByType(any())).willReturn(List.of());
        given(i18n.get("label.expense")).willReturn("Expense");
        given(i18n.get("label.income")).willReturn("Income");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.series()).hasSize(2);
        assertThat(result.series().get(0).data()).isEmpty();
        assertThat(result.series().get(1).data()).isEmpty();
    }
}
