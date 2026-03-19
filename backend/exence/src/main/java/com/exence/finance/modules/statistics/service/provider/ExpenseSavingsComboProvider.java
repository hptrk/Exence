package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.WidgetType;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.projection.MonthlyIncomeExpenseProjection;
import com.exence.finance.modules.statistics.repository.StatisticsRepository;
import com.exence.finance.modules.statistics.util.StatisticsConstants;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public final class ExpenseSavingsComboProvider implements WidgetDataProvider {

    private final StatisticsRepository statisticsRepository;

    @Override
    public WidgetType getSupportedType() {
        return WidgetType.EXPENSE_SAVINGS_COMBO;
    }

    @Override
    public SeriesPayload getData(WidgetRequest request) {
        List<MonthlyIncomeExpenseProjection> results =
                statisticsRepository.findMonthlyIncomeExpense(request.startDate(), request.endDate());

        List<YearMonth> months = DateUtils.getMonthsInRange(request.startDate(), request.endDate());

        List<DataPoint> expensePoints = new ArrayList<>();
        List<DataPoint> savingsRatePoints = new ArrayList<>();

        months.forEach(month -> {
            Optional<MonthlyIncomeExpenseProjection> value = ProviderHelper.findByMonth(results, month);

            BigDecimal income =
                    value.map(MonthlyIncomeExpenseProjection::getIncomeAmount).orElse(BigDecimal.ZERO);
            BigDecimal expense =
                    value.map(MonthlyIncomeExpenseProjection::getExpenseAmount).orElse(BigDecimal.ZERO);

            expensePoints.add(new DataPoint(month.toString(), expense, null));

            BigDecimal savingsRate = ProviderHelper.calculateSavingsRate(income, expense);
            savingsRatePoints.add(new DataPoint(month.toString(), savingsRate, null));
        });

        return new SeriesPayload(List.of(
                new SeriesItem("Expense", "column", StatisticsConstants.COLOR_EXPENSE_RED, expensePoints),
                new SeriesItem("Savings Rate", "line", null, savingsRatePoints)));
    }
}
