package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.dto.result.CategoryAmountResult;
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
class TopExpenseCategoryStatCardProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private StatisticsQueryService statisticsQueryService;

    @Mock
    private ProviderHelper providerHelper;

    @Spy
    private StatisticsFilterFactory filterFactory;

    @InjectMocks
    private TopExpenseCategoryStatCardProvider provider;

    @Test
    @DisplayName("returns TOP_EXPENSE_CATEGORY_STATCARD as the supported widget type")
    void getSupportedType_returnsTopExpenseCategoryStatCard() {
        assertThat(provider.getSupportedType()).isEqualTo(StatisticsWidgetType.TOP_EXPENSE_CATEGORY_STATCARD);
    }

    @Test
    @DisplayName("returns stat card with category name and amount when a top expense category exists")
    void getData_withTopCategory() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findTopCategoryByType(any()))
                .willReturn(new CategoryAmountResult("Food", "#FF0000", "food-icon", new BigDecimal("500")));
        given(providerHelper.computeTrend(any(), any(), any())).willReturn(TrendResult.NEUTRAL);

        // when
        StatCardPayload result = (StatCardPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(StatisticsWidgetType.TOP_EXPENSE_CATEGORY_STATCARD);
        assertThat(result.contextLabel()).isEqualTo("Food");
        assertThat(result.value()).isEqualByComparingTo(new BigDecimal("500"));
    }

    @Test
    @DisplayName("returns zero stat card with fallback label when no top expense category exists")
    void getData_withNoTopCategory() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());
        given(statisticsQueryService.findTopCategoryByType(any())).willReturn(null);
        given(i18n.get("label.no-transactions")).willReturn("No transactions");

        // when
        StatCardPayload result = (StatCardPayload) provider.getData(request);

        // then
        assertThat(result.value()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.contextLabel()).isEqualTo("No transactions");
    }
}
