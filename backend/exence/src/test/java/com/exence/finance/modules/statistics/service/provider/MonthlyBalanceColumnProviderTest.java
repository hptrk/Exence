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
class MonthlyBalanceColumnProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private MonthlyBalanceColumnProvider provider;

    @Test
    @DisplayName("returns MONTHLY_BALANCE_COLUMN as the supported widget type")
    void getSupportedType_returnsMonthlyBalanceColumn() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.MONTHLY_BALANCE_COLUMN);
    }

    @Test
    @DisplayName("returns one series with one data point for a single month range")
    void getData_withOneMonth() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findMonthlyBalance(any())).willReturn(List.of());
        given(providerHelper.getAmount(any(), any(), any())).willReturn(BigDecimal.ZERO);
        given(i18n.get("label.balance")).willReturn("Balance");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.MONTHLY_BALANCE_COLUMN);
        assertThat(result.series()).hasSize(1);
        assertThat(result.series().getFirst().data()).hasSize(1);
    }
}
