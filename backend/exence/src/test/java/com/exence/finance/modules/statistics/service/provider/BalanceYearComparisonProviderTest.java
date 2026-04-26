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
import com.exence.finance.modules.statistics.dto.result.MonthlyBalanceResult;
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
class BalanceYearComparisonProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Mock
    private I18nService i18n;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private BalanceYearComparisonProvider provider;

    @Test
    @DisplayName("returns BALANCE_YEAR_COMPARISON as the supported widget type")
    void getSupportedType_returnsBalanceYearComparison() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.BALANCE_YEAR_COMPARISON);
    }

    @Test
    @DisplayName("returns two series with 12 data points each when two years of data exist")
    void getData_withTwoYearsOfData() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2024, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(statisticsQueryService.findMonthlyBalance(any()))
                .willReturn(List.of(
                        new MonthlyBalanceResult(2024, 1, new BigDecimal("1000")),
                        new MonthlyBalanceResult(2025, 1, new BigDecimal("2000"))));
        given(providerHelper.getAmount(any(), any(), any())).willReturn(BigDecimal.ZERO);
        given(i18n.getMonthName(anyInt())).willReturn("Jan");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.BALANCE_YEAR_COMPARISON);
        assertThat(result.series()).hasSize(2);
        assertThat(result.series().getFirst().data()).hasSize(12);
    }

    @Test
    @DisplayName("returns empty series when no data is available")
    void getData_withNoData() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31), Timeframe.ALL_TIME, Map.of());
        given(statisticsQueryService.findMonthlyBalance(any())).willReturn(List.of());

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.series()).isEmpty();
    }
}
