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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MonthlyCategoryRadarProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private MonthlyCategoryRadarProvider provider;

    @Test
    @DisplayName("returns MONTHLY_CATEGORY_RADAR as the supported widget type")
    void getSupportedType_returnsMonthlyCategoryRadar() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.MONTHLY_CATEGORY_RADAR);
    }

    @Test
    @DisplayName("returns one series per month with one data point per category")
    void getData_withCategories() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findMonthlyCategoryTotals(any())).willReturn(java.util.List.of());
        given(providerHelper.getCategories(any())).willReturn(Set.of("Food"));
        given(providerHelper.getCategoryAmountForMonth(any(), any(), any())).willReturn(BigDecimal.ZERO);

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.MONTHLY_CATEGORY_RADAR);
        assertThat(result.series()).hasSize(1);
        assertThat(result.series().getFirst().data()).hasSize(1);
    }

    @Test
    @DisplayName("returns one series per month with empty data when no categories exist")
    void getData_withNoCategories() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findMonthlyCategoryTotals(any())).willReturn(java.util.List.of());
        given(providerHelper.getCategories(any())).willReturn(Set.of());

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.series()).hasSize(1);
        assertThat(result.series().getFirst().data()).isEmpty();
    }
}
