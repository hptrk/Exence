package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.BoxplotPayload;
import com.exence.finance.modules.statistics.dto.result.MonthlyBoxplotResult;
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
class MonthlyBoxplotProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private MonthlyBoxplotProvider provider;

    @Test
    @DisplayName("returns MONTHLY_BOXPLOT as the supported widget type")
    void getSupportedType_returnsMonthlyBoxplot() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.MONTHLY_BOXPLOT);
    }

    @Test
    @DisplayName("returns boxplot payload with one point per matching month when results exist")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findBoxplotByMonthExpense(any()))
                .willReturn(List.of(new MonthlyBoxplotResult(
                        2025,
                        1,
                        new BigDecimal("10"),
                        new BigDecimal("25"),
                        new BigDecimal("50"),
                        new BigDecimal("75"),
                        new BigDecimal("100"))));

        // when
        BoxplotPayload result = (BoxplotPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.MONTHLY_BOXPLOT);
        assertThat(result.data()).hasSize(1);
        assertThat(result.data().getFirst().x()).isEqualTo("2025-01");
    }

    @Test
    @DisplayName("returns zero-filled data points when no data is available")
    void getData_withEmptyResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findBoxplotByMonthExpense(any())).willReturn(List.of());

        // when
        BoxplotPayload result = (BoxplotPayload) provider.getData(request);

        // then
        assertThat(result.data()).hasSize(1);
        assertThat(result.data().getFirst().y()).containsOnly(BigDecimal.ZERO);
    }
}
