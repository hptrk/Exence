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
class SpendingRadarProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private SpendingRadarProvider provider;

    @Test
    @DisplayName("returns SPENDING_RADAR as the supported widget type")
    void getSupportedType_returnsSpendingRadar() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.SPENDING_RADAR);
    }

    @Test
    @DisplayName("returns distribution payload delegated from provider helper")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        DistributionPayload expected = new DistributionPayload(StatisticsWidgetType.SPENDING_RADAR, List.of());
        given(statisticsQueryService.findCategoryStatsAmount(any())).willReturn(List.of());
        given(providerHelper.buildCategoryAmountDistributionPayload(any(), any()))
                .willReturn(expected);

        // when
        DistributionPayload result = (DistributionPayload) provider.getData(request);

        // then
        assertThat(result).isEqualTo(expected);
    }
}
