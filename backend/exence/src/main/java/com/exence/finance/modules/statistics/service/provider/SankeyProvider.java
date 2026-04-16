package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsFilter;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
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

    private final I18nService i18n;
    private final StatisticsQueryService statisticsQueryService;
    private final StatisticsFilterFactory filterFactory;

    @Override
    public StatisticsWidgetType getSupportedType() {
        return StatisticsWidgetType.CATEGORY_SANKEY;
    }

    @Override
    public SankeyPayload getData(WidgetRequest request) {
        StatisticsFilter filter = filterFactory.fromRequest(request);
        List<CategoryFlowResult> results = statisticsQueryService.findCategoryFlow(filter);
        String centralNode = i18n.get("label.wallet");

        List<SankeyLink> links = results.stream()
                .map(p -> {
                    if (p.type() == TransactionType.INCOME) {
                        return new SankeyLink(p.categoryName(), centralNode, p.totalAmount(), p.categoryColor());
                    } else {
                        return new SankeyLink(centralNode, p.categoryName(), p.totalAmount(), p.categoryColor());
                    }
                })
                .toList();

        return new SankeyPayload(getSupportedType(), links);
    }
}
