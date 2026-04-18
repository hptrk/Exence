package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.BubblePayload;
import com.exence.finance.modules.statistics.dto.result.CategoryStatsResult;
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
class CategoryBubbleProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private CategoryBubbleProvider provider;

    @Test
    @DisplayName("returns CATEGORY_BUBBLE as the supported widget type")
    void getSupportedType_returnsCategoryBubble() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.CATEGORY_BUBBLE);
    }

    @Test
    @DisplayName("returns bubble payload with category series when results exist")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findCategoryStatsAmountCountAverage(any()))
                .willReturn(List.of(
                        new CategoryStatsResult("Food", "#FF0000", new BigDecimal("500"), 10L, new BigDecimal("50"))));

        // when
        BubblePayload result = (BubblePayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.CATEGORY_BUBBLE);
        assertThat(result.series()).hasSize(1);
        assertThat(result.series().getFirst().name()).isEqualTo("Food");
    }

    @Test
    @DisplayName("returns empty bubble series when no data is available")
    void getData_withEmptyResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findCategoryStatsAmountCountAverage(any())).willReturn(List.of());

        // when
        BubblePayload result = (BubblePayload) provider.getData(request);

        // then
        assertThat(result.series()).isEmpty();
    }
}
