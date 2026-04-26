package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.ScatterResult;
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
class TransactionScatterProviderTest {

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private TransactionScatterProvider provider;

    @Test
    @DisplayName("returns TRANSACTION_SCATTER as the supported widget type")
    void getSupportedType_returnsTransactionScatter() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.TRANSACTION_SCATTER);
    }

    @Test
    @DisplayName("returns series payload grouped by category when scatter data exists")
    void getData_withResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        List<ScatterResult> results =
                List.of(new ScatterResult(LocalDate.of(2025, 1, 10), new BigDecimal("100"), "Food", "#FF0000"));
        given(statisticsQueryService.findScatterData(any())).willReturn(results);
        given(providerHelper.getCategoryColorMap(any())).willReturn(Map.of("Food", "#FF0000"));

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.TRANSACTION_SCATTER);
        assertThat(result.series()).hasSize(1);
        assertThat(result.series().getFirst().name()).isEqualTo("Food");
    }

    @Test
    @DisplayName("returns empty series when no scatter data is available")
    void getData_withEmptyResults() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findScatterData(any())).willReturn(List.of());
        given(providerHelper.getCategoryColorMap(any())).willReturn(Map.of());

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.series()).isEmpty();
    }
}
