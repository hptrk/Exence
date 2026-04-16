package com.exence.finance.modules.statistics.service.provider.admin;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.repository.AdminStatisticsQueryService;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class MonthlyActiveUsersProvider implements AdminWidgetDataProvider {

    private final I18nService i18n;
    private final AdminStatisticsQueryService adminStatisticsQueryService;

    @Override
    public AdminWidgetType getSupportedType() {
        return AdminWidgetType.MONTHLY_ACTIVE_USERS;
    }

    @Override
    public SeriesPayload getData(AdminWidgetRequest request) {
        List<DataPoint> dataPoints =
                adminStatisticsQueryService.findMonthlyActiveUsers(request.startDate(), request.endDate()).stream()
                        .map(r -> new DataPoint(
                                YearMonth.of(r.year(), r.month()).toString(), BigDecimal.valueOf(r.count()), null))
                        .toList();

        return new SeriesPayload(
                getSupportedType(),
                List.of(new SeriesItem(i18n.get("label.admin.monthly-active-users"), "column", null, dataPoints)));
    }
}
