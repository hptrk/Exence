package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.SankeyLink;
import com.exence.finance.modules.statistics.dto.payload.SankeyPayload;
import com.exence.finance.modules.statistics.dto.result.CategoryFlowResult;
import com.exence.finance.modules.statistics.repository.StatisticsQueryService;
import com.exence.finance.modules.statistics.service.StatisticsFilterFactory;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class SankeyProvider implements WidgetDataProvider {

    private static final String CENTRAL_NODE = "Wallet";

    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.CATEGORY_SANKEY;
    }

    @Override
    public SankeyPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request);
        List<CategoryFlowResult> results = statisticsQueryService.findCategoryFlow(filter);

        List<SankeyLink> links = results.stream()
                .map(p -> {
                    if (p.type() == TransactionType.INCOME) {
                        return new SankeyLink(p.categoryName(), CENTRAL_NODE, p.totalAmount(), p.categoryColor());
                    } else {
                        return new SankeyLink(CENTRAL_NODE, p.categoryName(), p.totalAmount(), p.categoryColor());
                    }
                })
                .toList();

        return new SankeyPayload(links);
    }
}
