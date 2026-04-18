package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
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
class NoSpendDaysStatCardProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private NoSpendDaysStatCardProvider provider;

    @Test
    @DisplayName("returns NO_SPEND_DAYS_STATCARD as the supported widget type")
    void getSupportedType_returnsNoSpendDaysStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.NO_SPEND_DAYS_STATCARD);
    }

    @Test
    @DisplayName("returns stat card payload with no-spend day count and unit label")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.countNoSpendDays(any())).willReturn(10L);
        given(providerHelper.computeTrend(any(), any(), any())).willReturn(TrendResult.NEUTRAL);
        given(i18n.getUnitLabel(anyLong(), anyString(), anyString())).willReturn("days");
        given(i18n.get(anyString(), any())).willReturn("of 31 days");

        // when
        StatCardPayload result = (StatCardPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.NO_SPEND_DAYS_STATCARD);
        assertThat(result.value()).isEqualByComparingTo(java.math.BigDecimal.valueOf(10));
        assertThat(result.unit()).isEqualTo("days");
    }
}
