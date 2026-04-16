package com.exence.finance.modules.statistics.service.provider.admin;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.repository.AdminStatisticsQueryService;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class TransactionVelocityProvider implements AdminWidgetDataProvider {

    private final I18nService i18n;
    private final AdminStatisticsQueryService adminStatisticsQueryService;

    @Override
    public AdminWidgetType getSupportedType() {
        return AdminWidgetType.TRANSACTION_VELOCITY;
    }

    @Override
    public SeriesPayload getData(AdminWidgetRequest request) {
        List<DataPoint> dataPoints =
                adminStatisticsQueryService.findDailyTransactionCount(request.startDate(), request.endDate()).stream()
                        .map(r -> new DataPoint(r.date().toString(), BigDecimal.valueOf(r.count()), null))
                        .toList();

        return new SeriesPayload(
                getSupportedType(),
                List.of(new SeriesItem(i18n.get("label.admin.transactions"), "bar", null, dataPoints)));
    }
}
