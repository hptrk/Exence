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
class IncomeExpenseColumnProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private IncomeExpenseColumnProvider provider;

    @Test
    @DisplayName("returns INCOME_EXPENSE_COLUMN as the supported widget type")
    void getSupportedType_returnsIncomeExpenseColumn() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.INCOME_EXPENSE_COLUMN);
    }

    @Test
    @DisplayName("returns two series each with one zero-value data point for a single month range")
    void getData_withOneMonth() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findMonthlyIncomeExpense(any())).willReturn(List.of());
        given(providerHelper.findByMonth(any(), any())).willReturn(Optional.empty());
        given(i18n.get("label.income")).willReturn("Income");
        given(i18n.get("label.expense")).willReturn("Expense");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.INCOME_EXPENSE_COLUMN);
        assertThat(result.series()).hasSize(2);
        assertThat(result.series().getFirst().data()).hasSize(1);
        assertThat(result.series().getFirst().data().getFirst().y()).isEqualByComparingTo(BigDecimal.ZERO);
    }
}
