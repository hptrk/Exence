package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.dto.result.CategoryAverageResult;
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
class CategoryAvgPolarProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private CategoryAvgPolarProvider provider;

    @Test
    @DisplayName("returns CATEGORY_AVG_POLAR as the supported widget type")
    void getSupportedType_returnsCategoryAvgPolar() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.CATEGORY_AVG_POLAR);
    }

    @Test
    @DisplayName("returns distribution payload with category data when results exist")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findCategoryStatsAverage(any()))
                .willReturn(List.of(new CategoryAverageResult("Food", "#FF0000", new BigDecimal("150"))));

        // when
        DistributionPayload result = (DistributionPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.CATEGORY_AVG_POLAR);
        assertThat(result.data()).hasSize(1);
        assertThat(result.data().getFirst().name()).isEqualTo("Food");
    }

    @Test
    @DisplayName("returns empty distribution when no data is available")
    void getData_withEmptyResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findCategoryStatsAverage(any())).willReturn(List.of());

        // when
        DistributionPayload result = (DistributionPayload) provider.getData(request);

        // then
        assertThat(result.data()).isEmpty();
    }
}
