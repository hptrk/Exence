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
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExpenseSavingsComboProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private ExpenseSavingsComboProvider provider;

    @Test
    @DisplayName("returns EXPENSE_SAVINGS_COMBO as the supported widget type")
    void getSupportedType_returnsExpenseSavingsCombo() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.EXPENSE_SAVINGS_COMBO);
    }

    @Test
    @DisplayName("returns two series each with one data point for a single month range")
    void getData_withOneMonth() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findMonthlyIncomeExpense(any())).willReturn(List.of());
        given(providerHelper.findByMonth(any(), any())).willReturn(Optional.empty());
        given(providerHelper.calculateSavingsRate(any(), any())).willReturn(BigDecimal.ZERO);
        given(i18n.get("label.expense")).willReturn("Expense");
        given(i18n.get("label.savings-rate")).willReturn("Savings Rate");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.EXPENSE_SAVINGS_COMBO);
        assertThat(result.series()).hasSize(2);
        assertThat(result.series().getFirst().data()).hasSize(1);
    }
}
