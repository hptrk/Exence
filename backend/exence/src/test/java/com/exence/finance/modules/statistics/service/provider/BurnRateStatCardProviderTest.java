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
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BurnRateStatCardProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Mock
    private I18nService i18n;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private BurnRateStatCardProvider provider;

    @Test
    @DisplayName("returns BURN_RATE_STATCARD as the supported widget type")
    void getSupportedType_returnsBurnRateStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.BURN_RATE_STATCARD);
    }

    @Test
    @DisplayName("returns stat card payload with burn rate value and currency unit")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.sumAmountByType(any())).willReturn(new BigDecimal("3100"));
        given(providerHelper.computeTrend(any(), any(), any())).willReturn(TrendResult.NEUTRAL);
        given(providerHelper.getUserCurrencySymbol()).willReturn("€");
        given(i18n.get("context.per-day")).willReturn("per day");

        // when
        StatCardPayload result = (StatCardPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.BURN_RATE_STATCARD);
        assertThat(result.unit()).isEqualTo("€");
        assertThat(result.trend()).isEqualTo(Trend.NEUTRAL);
    }
}
