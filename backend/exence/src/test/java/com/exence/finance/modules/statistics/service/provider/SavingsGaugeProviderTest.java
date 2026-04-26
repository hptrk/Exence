package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.GaugePayload;
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
class SavingsGaugeProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private SavingsGaugeProvider provider;

    @Test
    @DisplayName("returns SAVINGS_RATE_GAUGE as the supported widget type")
    void getSupportedType_returnsSavingsRateGauge() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.SAVINGS_RATE_GAUGE);
    }

    @Test
    @DisplayName("returns gauge payload with the calculated savings rate")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.sumByType(any())).willReturn(List.of());
        given(providerHelper.calculateSavingsRate(any(), any())).willReturn(new BigDecimal("25.00"));

        // when
        GaugePayload result = (GaugePayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.SAVINGS_RATE_GAUGE);
        assertThat(result.data()).isEqualByComparingTo(new BigDecimal("25.00"));
    }
}
