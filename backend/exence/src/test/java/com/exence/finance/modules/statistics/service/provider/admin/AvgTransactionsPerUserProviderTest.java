package com.exence.finance.modules.statistics.service.provider.admin;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.MonthlyAvgResult;
import com.exence.finance.modules.statistics.repository.AdminStatisticsQueryService;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AvgTransactionsPerUserProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private AdminStatisticsQueryService adminStatisticsQueryService;

    @InjectMocks
    private AvgTransactionsPerUserProvider provider;

    @Test
    @DisplayName("returns AVG_TRANSACTIONS_PER_USER as the supported widget type")
    void getSupportedType_returnsAvgTransactionsPerUser() {
        assertThat(provider.getSupportedType()).isEqualTo(AdminWidgetType.AVG_TRANSACTIONS_PER_USER);
    }

    @Test
    @DisplayName("returns series payload with monthly averages when data exists")
    void getData_withResults() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.findAvgTransactionsPerUserByMonth(any(), any()))
                .willReturn(List.of(new MonthlyAvgResult(2025, 1, 3.5)));
        given(i18n.get("label.admin.avg-transactions-per-user")).willReturn("Avg Transactions");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(AdminWidgetType.AVG_TRANSACTIONS_PER_USER);
        assertThat(result.series().getFirst().data()).hasSize(1);
    }

    @Test
    @DisplayName("returns empty series when no monthly average data is available")
    void getData_withEmptyResults() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.findAvgTransactionsPerUserByMonth(any(), any()))
                .willReturn(List.of());
        given(i18n.get("label.admin.avg-transactions-per-user")).willReturn("Avg Transactions");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.series().getFirst().data()).isEmpty();
    }
}
