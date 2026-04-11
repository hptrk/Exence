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
public final class TransactionTypeDistributionProvider implements AdminWidgetDataProvider {

    private final AdminStatisticsQueryService adminStatisticsQueryService;

    @Override
    public AdminWidgetType getSupportedType() {
        return AdminWidgetType.TRANSACTION_TYPE_DISTRIBUTION;
    }

    @Override
    public DistributionPayload getData(AdminWidgetRequest request) {
        List<DistributionItem> items =
                adminStatisticsQueryService
                        .findTransactionTypeDistribution(request.startDate(), request.endDate())
                        .stream()
                        .map(r -> new DistributionItem(r.type().name(), BigDecimal.valueOf(r.count()), null))
                        .toList();

        return new DistributionPayload(getSupportedType(), items);
    }
}
