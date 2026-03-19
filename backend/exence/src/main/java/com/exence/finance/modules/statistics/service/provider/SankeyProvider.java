package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.SankeyLink;
import com.exence.finance.modules.statistics.dto.payload.SankeyPayload;
import com.exence.finance.modules.statistics.dto.projection.CategoryFlowProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class SankeyProvider implements WidgetDataProvider {

    private static final String CENTRAL_NODE = "Wallet";

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.CATEGORY_SANKEY;
    }

    @Override
    public SankeyPayload getData(WidgetRequest request) {
        List<CategoryFlowProjection> results =
                statisticsRepository.findCategoryFlow(request.startDate(), request.endDate());

        List<SankeyLink> links = results.stream()
                .map(p -> {
                    if (p.getType() == TransactionType.INCOME) {
                        return new SankeyLink(
                                p.getCategoryName(), CENTRAL_NODE, p.getTotalAmount(), p.getCategoryColor());
                    } else {
                        return new SankeyLink(
                                CENTRAL_NODE, p.getCategoryName(), p.getTotalAmount(), p.getCategoryColor());
                    }
                })
                .toList();

        return new SankeyPayload(links);
    }
}
