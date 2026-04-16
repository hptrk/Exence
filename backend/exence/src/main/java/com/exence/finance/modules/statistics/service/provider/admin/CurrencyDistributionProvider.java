package com.exence.finance.modules.statistics.service.provider.admin;

import com.exence.finance.modules.statistics.dto.admin.AdminWidgetRequest;
import com.exence.finance.modules.statistics.dto.admin.AdminWidgetType;
import com.exence.finance.modules.statistics.dto.payload.DistributionItem;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.repository.AdminStatisticsQueryService;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class CurrencyDistributionProvider implements AdminWidgetDataProvider {

    private final AdminStatisticsQueryService adminStatisticsQueryService;

    @Override
    public AdminWidgetType getSupportedType() {
        return AdminWidgetType.CURRENCY_DISTRIBUTION;
    }

    @Override
    public DistributionPayload getData(AdminWidgetRequest request) {
        List<DistributionItem> items =
                adminStatisticsQueryService.findCurrencyDistribution(request.startDate(), request.endDate()).stream()
                        .map(r -> new DistributionItem(r.currency().name(), BigDecimal.valueOf(r.count()), null))
                        .toList();

        return new DistributionPayload(getSupportedType(), items);
    }
}
