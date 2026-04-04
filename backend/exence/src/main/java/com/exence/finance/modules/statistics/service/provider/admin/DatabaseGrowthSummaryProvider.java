package com.exence.finance.modules.statistics.service.provider.admin;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.SummaryItem;
import com.exence.finance.modules.statistics.dto.payload.SummaryPayload;
import com.exence.finance.modules.statistics.repository.AdminStatisticsQueryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class DatabaseGrowthSummaryProvider implements AdminWidgetDataProvider {

    private final I18nService i18n;
    private final AdminStatisticsQueryService adminStatisticsQueryService;

    @Override
    public AdminWidgetType getSupportedType() {
        return AdminWidgetType.DATABASE_GROWTH_SUMMARY;
    }

    @Override
    public SummaryPayload getData(AdminWidgetRequest request) {
        long totalUsers = adminStatisticsQueryService.countTotalUsers();
        long totalTransactions = adminStatisticsQueryService.countTotalTransactions();
        long totalCategories = adminStatisticsQueryService.countTotalCategories();

        return new SummaryPayload(List.of(
                new SummaryItem(i18n.get("label.admin.total-users"), totalUsers, "people"),
                new SummaryItem(i18n.get("label.admin.total-transactions"), totalTransactions, "receipt-text"),
                new SummaryItem(i18n.get("label.admin.total-categories"), totalCategories, "tag")));
    }
}
