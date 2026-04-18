package com.exence.finance.modules.statistics.service.provider.admin;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.SummaryPayload;
import com.exence.finance.modules.statistics.repository.AdminStatisticsQueryService;
import java.time.LocalDate;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DatabaseGrowthSummaryProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private AdminStatisticsQueryService adminStatisticsQueryService;

    @InjectMocks
    private DatabaseGrowthSummaryProvider provider;

    @Test
    @DisplayName("returns DATABASE_GROWTH_SUMMARY as the supported widget type")
    void getSupportedType_returnsDatabaseGrowthSummary() {
        assertThat(provider.getSupportedType()).isEqualTo(AdminWidgetType.DATABASE_GROWTH_SUMMARY);
    }

    @Test
    @DisplayName("returns summary payload with three items covering users, transactions, and categories")
    void getData_returnsThreeSummaryItems() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.countTotalUsers()).willReturn(100L);
        given(adminStatisticsQueryService.countTotalTransactions()).willReturn(5000L);
        given(adminStatisticsQueryService.countTotalCategories()).willReturn(50L);
        given(i18n.get(anyString())).willReturn("label");

        // when
        SummaryPayload result = (SummaryPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(AdminWidgetType.DATABASE_GROWTH_SUMMARY);
        assertThat(result.items()).hasSize(3);
    }
}
