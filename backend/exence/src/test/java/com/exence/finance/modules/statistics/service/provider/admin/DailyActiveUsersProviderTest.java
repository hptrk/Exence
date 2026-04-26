package com.exence.finance.modules.statistics.service.provider.admin;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.result.DailyCountResult;
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
class DailyActiveUsersProviderTest {

    @Mock
    private I18nService i18n;

    @Mock
    private AdminStatisticsQueryService adminStatisticsQueryService;

    @InjectMocks
    private DailyActiveUsersProvider provider;

    @Test
    @DisplayName("returns DAILY_ACTIVE_USERS as the supported widget type")
    void getSupportedType_returnsDailyActiveUsers() {
        assertThat(provider.getSupportedType()).isEqualTo(AdminWidgetType.DAILY_ACTIVE_USERS);
    }

    @Test
    @DisplayName("returns series payload with daily user counts when data exists")
    void getData_withResults() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH);
        given(adminStatisticsQueryService.findDailyActiveUsers(any(), any()))
                .willReturn(List.of(new DailyCountResult(LocalDate.of(2025, 1, 10), 5L)));
        given(i18n.get("label.admin.daily-active-users")).willReturn("Daily Active Users");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(AdminWidgetType.DAILY_ACTIVE_USERS);
        assertThat(result.series().getFirst().data()).hasSize(1);
    }

    @Test
    @DisplayName("returns empty series when no daily active user data is available")
    void getData_withEmptyResults() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH);
        given(adminStatisticsQueryService.findDailyActiveUsers(any(), any())).willReturn(List.of());
        given(i18n.get("label.admin.daily-active-users")).willReturn("Daily Active Users");

        // when
        SeriesPayload result = (SeriesPayload) provider.getData(request);

        // then
        assertThat(result.series().getFirst().data()).isEmpty();
    }
}
