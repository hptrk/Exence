package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
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
class WealthGrowthComboProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private WealthGrowthComboProvider provider;

    @Test
    @DisplayName("returns WEALTH_GROWTH_COMBO as the supported widget type")
    void getSupportedType_returnsWealthGrowthCombo() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.WEALTH_GROWTH_COMBO);
    }

    @Test
    @DisplayName("returns two series with cumulative balance data points for the given time range")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findMonthlyBalance(any())).willReturn(List.of());
        given(providerHelper.getAmount(any(), any(), any())).willReturn(new BigDecimal("500"));
        given(i18n.get("label.profit")).willReturn("Profit");
        given(i18n.get("label.cumulative-balance")).willReturn("Cumulative");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.WEALTH_GROWTH_COMBO);
        assertThat(result.series()).hasSize(2);
        assertThat(result.series().get(0).data().getFirst().y()).isEqualByComparingTo(new BigDecimal("500"));
        assertThat(result.series().get(1).data().getFirst().y()).isEqualByComparingTo(new BigDecimal("500"));
    }
}
