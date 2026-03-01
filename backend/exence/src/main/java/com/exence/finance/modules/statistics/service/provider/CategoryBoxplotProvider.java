package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.BoxplotPayload;
import com.exence.finance.modules.statistics.dto.payload.BoxplotPoint;
import com.exence.finance.modules.transaction.repository.TransactionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class CategoryBoxplotProvider implements WidgetDataProvider {

    private static final int NAME_INDEX = 0;
    private static final int COLOR_INDEX = 1;
    private static final int MIN_INDEX = 2;
    private static final int Q1_INDEX = 3;
    private static final int MEDIAN_INDEX = 4;
    private static final int Q3_INDEX = 5;
    private static final int MAX_INDEX = 6;

    private final TransactionRepository transactionRepository;
    private final UserService userService;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.CATEGORY_BOXPLOT;
    }

    @Override
    public BoxplotPayload getData(WidgetRequest request) {
        List<Object[]> results = transactionRepository.findBoxplotByExpenseCategory(
                userService.getCurrentUserId(), request.startDate(), request.endDate());

        List<BoxplotPoint> points = results.stream()
                .map(row -> new BoxplotPoint(
                        (String) row[NAME_INDEX],
                        List.of(
                                ProviderHelper.toBigDecimal(row[MIN_INDEX]),
                                ProviderHelper.toBigDecimal(row[Q1_INDEX]),
                                ProviderHelper.toBigDecimal(row[MEDIAN_INDEX]),
                                ProviderHelper.toBigDecimal(row[Q3_INDEX]),
                                ProviderHelper.toBigDecimal(row[MAX_INDEX])),
                        (String) row[COLOR_INDEX]))
                .toList();

        return new BoxplotPayload(points);
    }
}
