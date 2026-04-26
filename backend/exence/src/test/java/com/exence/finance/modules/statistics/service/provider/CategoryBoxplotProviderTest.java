package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.BoxplotPayload;
import com.exence.finance.modules.statistics.dto.result.CategoryBoxplotResult;
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
class CategoryBoxplotProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private CategoryBoxplotProvider provider;

    @Test
    @DisplayName("returns CATEGORY_BOXPLOT as the supported widget type")
    void getSupportedType_returnsCategoryBoxplot() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.CATEGORY_BOXPLOT);
    }

    @Test
    @DisplayName("returns boxplot payload with category data when results exist")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findBoxplotByExpenseCategory(any()))
                .willReturn(List.of(new CategoryBoxplotResult(
                        "Food",
                        "#FF0000",
                        new BigDecimal("10"),
                        new BigDecimal("25"),
                        new BigDecimal("50"),
                        new BigDecimal("75"),
                        new BigDecimal("100"))));

        // when
        BoxplotPayload result = (BoxplotPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.CATEGORY_BOXPLOT);
        assertThat(result.data()).hasSize(1);
        assertThat(result.data().getFirst().x()).isEqualTo("Food");
    }

    @Test
    @DisplayName("returns empty boxplot when no data is available")
    void getData_withEmptyResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findBoxplotByExpenseCategory(any())).willReturn(List.of());

        // when
        BoxplotPayload result = (BoxplotPayload) provider.getData(request);

        // then
        assertThat(result.data()).isEmpty();
    }
}
