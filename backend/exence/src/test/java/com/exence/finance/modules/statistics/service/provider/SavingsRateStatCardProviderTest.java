package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.dto.payload.Trend;
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
class SavingsRateStatCardProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private SavingsRateStatCardProvider provider;

    @Test
    @DisplayName("returns SAVINGS_RATE_STATCARD as the supported widget type")
    void getSupportedType_returnsSavingsRateStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.SAVINGS_RATE_STATCARD);
    }

    @Test
    @DisplayName("returns stat card payload with savings rate value, percent unit and trend")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.sumByType(any())).willReturn(List.of());
        given(providerHelper.toTypeAmountMap(any())).willReturn(Map.of());
        given(providerHelper.calculateSavingsRate(any(), any())).willReturn(new BigDecimal("30.00"));
        given(providerHelper.computeTrendByDifference(any(), any(), any())).willReturn(TrendResult.NEUTRAL);
        given(i18n.get("unit.percent")).willReturn("%");

        // when
        StatCardPayload result = (StatCardPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.SAVINGS_RATE_STATCARD);
        assertThat(result.unit()).isEqualTo("%");
        assertThat(result.trend()).isEqualTo(Trend.NEUTRAL);
    }
}
