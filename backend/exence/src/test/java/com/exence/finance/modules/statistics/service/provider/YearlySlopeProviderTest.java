package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.SlopePayload;
import com.exence.finance.modules.statistics.dto.result.YearlyCategoryResult;
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
class YearlySlopeProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private YearlySlopeProvider provider;

    @Test
    @DisplayName("returns YEARLY_SLOPE as the supported widget type")
    void getSupportedType_returnsYearlySlope() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.YEARLY_SLOPE);
    }

    @Test
    @DisplayName("returns slope payload with yearly category data when results exist")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2024, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(statisticsQueryService.findYearlyCategoryTotals(any()))
                .willReturn(List.of(
                        new YearlyCategoryResult("Food", "#FF0000", 2024, new BigDecimal("1200")),
                        new YearlyCategoryResult("Food", "#FF0000", 2025, new BigDecimal("1500"))));

        // when
        SlopePayload result = (SlopePayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.YEARLY_SLOPE);
        assertThat(result.data()).hasSize(1);
        assertThat(result.data().getFirst().category()).isEqualTo("Food");
        assertThat(result.data().getFirst().yearsData()).containsKeys("2024", "2025");
    }

    @Test
    @DisplayName("returns empty slope payload when no yearly data is available")
    void getData_withEmptyResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2024, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(statisticsQueryService.findYearlyCategoryTotals(any())).willReturn(List.of());

        // when
        SlopePayload result = (SlopePayload) provider.getData(request);

        // then
        assertThat(result.data()).isEmpty();
    }
}
