package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
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
class MonthlyPeakPolarProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private MonthlyPeakPolarProvider provider;

    @Test
    @DisplayName("returns MONTHLY_PEAK_POLAR as the supported widget type")
    void getSupportedType_returnsMonthlyPeakPolar() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.MONTHLY_PEAK_POLAR);
    }

    @Test
    @DisplayName("returns one distribution item per month in the requested range")
    void getData_withOneMonth() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findMonthlyPeakByType(any())).willReturn(List.of());
        given(providerHelper.getAmount(any(), any(), any())).willReturn(BigDecimal.ZERO);

        // when
        DistributionPayload result = (DistributionPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.MONTHLY_PEAK_POLAR);
        assertThat(result.data()).hasSize(1);
    }
}
