package com.exence.finance.modules.statistics.service.provider.admin;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.dto.result.CurrencyCountResult;
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
class CurrencyDistributionProviderTest {

    @Mock
    private AdminStatisticsQueryService adminStatisticsQueryService;

    @InjectMocks
    private CurrencyDistributionProvider provider;

    @Test
    @DisplayName("returns CURRENCY_DISTRIBUTION as the supported widget type")
    void getSupportedType_returnsCurrencyDistribution() {
        assertThat(provider.getSupportedType()).isEqualTo(AdminWidgetType.CURRENCY_DISTRIBUTION);
    }

    @Test
    @DisplayName("returns distribution payload with currency entries when data exists")
    void getData_withResults() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.findCurrencyDistribution(any(), any()))
                .willReturn(List.of(new CurrencyCountResult(SupportedCurrency.EUR, 10L)));

        // when
        DistributionPayload result = (DistributionPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(AdminWidgetType.CURRENCY_DISTRIBUTION);
        assertThat(result.data()).hasSize(1);
        assertThat(result.data().getFirst().name()).isEqualTo("EUR");
    }

    @Test
    @DisplayName("returns empty distribution when no currency data is available")
    void getData_withEmptyResults() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.findCurrencyDistribution(any(), any()))
                .willReturn(List.of());

        // when
        DistributionPayload result = (DistributionPayload) provider.getData(request);

        // then
        assertThat(result.data()).isEmpty();
    }
}
