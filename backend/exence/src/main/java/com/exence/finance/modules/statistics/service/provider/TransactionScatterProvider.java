package com.exence.finance.modules.statistics.service.provider;

import static com.exence.finance.common.util.DateUtils.toDisplayDate;

import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.projection.ScatterProjection;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class TransactionScatterProvider implements WidgetDataProvider {

    private final TransactionRepository transactionRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.TRANSACTION_SCATTER;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        List<ScatterProjection> results =
                transactionRepository.findScatterData(request.startDate(), request.endDate(), TransactionType.EXPENSE);

        Map<String, String> categoryColorMap = ProviderHelper.getCategoryColorMap(results);

        Map<String, List<DataPoint>> categoryPoints = new LinkedHashMap<>();
        categoryColorMap.keySet().forEach(cat -> categoryPoints.put(cat, new ArrayList<>()));

        for (ScatterProjection p : results) {
            categoryPoints
                    .get(p.getCategoryName())
                    .add(new DataPoint(toDisplayDate(p.getTransactionDate()), p.getAmount(), null));
        }

        List<SeriesItem> series = categoryPoints.entrySet().stream()
                .map(e -> new SeriesItem(e.getKey(), null, categoryColorMap.get(e.getKey()), e.getValue()))
                .toList();

        return new SeriesPayload(series);
    }
}
