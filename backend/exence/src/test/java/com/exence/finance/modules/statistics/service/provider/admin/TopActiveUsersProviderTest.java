package com.exence.finance.modules.statistics.service.provider.admin;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.BDDMockito.given;

import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.LeaderboardPayload;
import com.exence.finance.modules.statistics.dto.result.TopUserResult;
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
class TopActiveUsersProviderTest {

    @Mock
    private AdminStatisticsQueryService adminStatisticsQueryService;

    @InjectMocks
    private TopActiveUsersProvider provider;

    @Test
    @DisplayName("returns TOP_ACTIVE_USERS as the supported widget type")
    void getSupportedType_returnsTopActiveUsers() {
        assertThat(provider.getSupportedType()).isEqualTo(AdminWidgetType.TOP_ACTIVE_USERS);
    }

    @Test
    @DisplayName("returns sorted user list with assigned ranks when data exists")
    void getData_withResults() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.findTopActiveUsers(any(), any(), anyInt()))
                .willReturn(List.of(new TopUserResult("alice", 150L), new TopUserResult("bob", 120L)));

        // when
        LeaderboardPayload result = (LeaderboardPayload) provider.getData(request);

        // then
        assertThat(result.type()).isEqualTo(AdminWidgetType.TOP_ACTIVE_USERS);
        assertThat(result.entries()).hasSize(2);
        assertThat(result.entries().get(0).rank()).isEqualTo(1);
        assertThat(result.entries().get(1).rank()).isEqualTo(2);
    }

    @Test
    @DisplayName("returns empty leaderboard when no active user data is available")
    void getData_withEmptyResults() {
        // given
        AdminWidgetRequest request =
                new AdminWidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS);
        given(adminStatisticsQueryService.findTopActiveUsers(any(), any(), anyInt()))
                .willReturn(List.of());

        // when
        LeaderboardPayload result = (LeaderboardPayload) provider.getData(request);

        // then
        assertThat(result.entries()).isEmpty();
    }
}
