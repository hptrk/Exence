package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.SankeyPayload;
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
class SankeyProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private SankeyProvider provider;

    @Test
    @DisplayName("returns CATEGORY_SANKEY as the supported widget type")
    void getSupportedType_returnsCategorySankey() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.CATEGORY_SANKEY);
    }

    @Test
    @DisplayName("returns links with correct source and target directions for mixed income and expense data")
    void getData_withMixedResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findCategoryFlow(any()))
                .willReturn(List.of(
                        new CategoryFlowResult(TransactionType.INCOME, "Salary", "#00FF00", new BigDecimal("1000")),
                        new CategoryFlowResult(TransactionType.EXPENSE, "Food", "#FF0000", new BigDecimal("300"))));
        given(i18n.get("label.wallet")).willReturn("Wallet");

        // when
        SankeyPayload result = (SankeyPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.CATEGORY_SANKEY);
        assertThat(result.data()).hasSize(2);
        assertThat(result.data().get(0).from()).isEqualTo("Salary");
        assertThat(result.data().get(0).to()).isEqualTo("Wallet");
        assertThat(result.data().get(1).from()).isEqualTo("Wallet");
        assertThat(result.data().get(1).to()).isEqualTo("Food");
    }

    @Test
    @DisplayName("returns empty sankey payload when no data is available")
    void getData_withEmptyResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findCategoryFlow(any())).willReturn(List.of());
        given(i18n.get("label.wallet")).willReturn("Wallet");

        // when
        SankeyPayload result = (SankeyPayload) provider.getData(request);

        // then
        assertThat(result.data()).isEmpty();
    }
}
