package com.exence.finance.modules.statistics.service.provider.admin;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.dto.result.TypeCountResult;
import com.exence.finance.modules.statistics.repository.AdminStatisticsQueryService;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TransactionTypeDistributionProviderTest {

    @Mock
    private AdminStatisticsQueryService adminStatisticsQueryService;

    @InjectMocks
    private TransactionTypeDistributionProvider provider;

    @Test
    @DisplayName("returns TRANSACTION_TYPE_DISTRIBUTION as the supported widget type")
    void getSupportedType_returnsTransactionTypeDistribution() {
        assertThat(provider.getSupportedType()).isEqualTo(AdminWidgetType.TRANSACTION_TYPE_DISTRIBUTION);
    }

    @Test
    @DisplayName("returns distribution payload with income and expense entries when data exists")
    void getData_withResults() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.findTransactionTypeDistribution(any(), any()))
                .willReturn(List.of(
                        new TypeCountResult(TransactionType.EXPENSE, 300L),
                        new TypeCountResult(TransactionType.INCOME, 150L)));

        // when
        DistributionPayload result = (DistributionPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(AdminWidgetType.TRANSACTION_TYPE_DISTRIBUTION);
        assertThat(result.data()).hasSize(2);
    }

    @Test
    @DisplayName("returns empty distribution when no transaction type data is available")
    void getData_withEmptyResults() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.findTransactionTypeDistribution(any(), any()))
                .willReturn(List.of());

        // when
        DistributionPayload result = (DistributionPayload) provider.getData(request);

        // then
        assertThat(result.data()).isEmpty();
    }
}
