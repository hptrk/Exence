package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.dto.result.TopTransactionResult;
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
class TopExpenseTransactionStatCardProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private TopExpenseTransactionStatCardProvider provider;

    @Test
    @DisplayName("returns TOP_EXPENSE_TRANSACTION_STATCARD as the supported widget type")
    void getSupportedType_returnsTopExpenseTransactionStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.TOP_EXPENSE_TRANSACTION_STATCARD);
    }

    @Test
    @DisplayName("returns stat card with transaction name and amount when a top expense transaction exists")
    void getData_withTopTransaction() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findTopTransactionByType(any()))
                .willReturn(new TopTransactionResult(new BigDecimal("350"), "Restaurant", "#FF0000", "food"));
        given(providerHelper.computeTrend(any(), any(), any())).willReturn(TrendResult.NEUTRAL);

        // when
        StatCardPayload result = (StatCardPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.TOP_EXPENSE_TRANSACTION_STATCARD);
        assertThat(result.contextLabel()).isEqualTo("Restaurant");
        assertThat(result.value()).isEqualByComparingTo(new BigDecimal("350"));
    }

    @Test
    @DisplayName("returns zero stat card when no top expense transaction exists")
    void getData_withNoTopTransaction() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findTopTransactionByType(any())).willReturn(null);
        given(i18n.get("label.no-transactions")).willReturn("No transactions");

        // when
        StatCardPayload result = (StatCardPayload) provider.getData(request);

        // then
        assertThat(result.value()).isEqualByComparingTo(BigDecimal.ZERO);
    }
}
