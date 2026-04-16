package com.exence.finance.modules.statistics.service.provider.admin;

import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.LeaderboardEntry;
import com.exence.finance.modules.statistics.dto.payload.LeaderboardPayload;
import com.exence.finance.modules.statistics.repository.AdminStatisticsQueryService;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class TopActiveUsersProvider implements AdminWidgetDataProvider {

    private static final int TOP_N = 3;

    private final AdminStatisticsQueryService adminStatisticsQueryService;

    @Override
    public AdminWidgetType getSupportedType() {
        return AdminWidgetType.TOP_ACTIVE_USERS;
    }

    @Override
    public LeaderboardPayload getData(AdminWidgetRequest request) {
        AtomicInteger rank = new AtomicInteger(1);

        List<LeaderboardEntry> entries =
                adminStatisticsQueryService.findTopActiveUsers(request.startDate(), request.endDate(), TOP_N).stream()
                        .map(r -> new LeaderboardEntry(rank.getAndIncrement(), r.username(), r.transactionCount()))
                        .toList();

        return new LeaderboardPayload(getSupportedType(), entries);
    }
}
