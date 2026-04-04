package com.exence.finance.modules.statistics.service.provider;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.common.util.DateUtils;
import com.exence.finance.modules.auth.repository.UserSettingsRepository;
import com.exence.finance.modules.auth.service.UserService;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.DataPoint;
import com.exence.finance.modules.statistics.dto.payload.DistributionItem;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.dto.payload.SeriesItem;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.dto.payload.Trend;
import com.exence.finance.modules.statistics.dto.result.CategoryAmountResult;
import com.exence.finance.modules.statistics.dto.result.CategoryResult;
import com.exence.finance.modules.statistics.dto.result.MonthlyCategoryResult;
import com.exence.finance.modules.statistics.dto.result.MonthlyResult;
import com.exence.finance.modules.statistics.dto.result.TypeAmountResult;
import com.exence.finance.modules.transaction.dto.TransactionType;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProviderHelper {

    private final I18nService i18n;
    private final UserSettingsRepository userSettingsRepository;
    private final UserService userService;

    private static final int DIVISION_SCALE = 4;
    private static final int PERCENTAGE_MULTIPLIER = 100;
    private static final int DISPLAY_SCALE = 2;

    // --- BUILDERS ---

    public SeriesPayload buildMonthlyCategorySeriesPayload(
            List<MonthlyCategoryResult> results, List<YearMonth> months, String seriesType, String totalColor) {
        Map<String, String> colors = getCategoryColorMap(results);

        // main series for each category
        List<SeriesItem> series = new ArrayList<>(colors.keySet().stream()
                .map(category -> {
                    List<DataPoint> points = months.stream()
                            .map(month -> new DataPoint(
                                    month.toString(), getCategoryAmountForMonth(results, category, month), null))
                            .toList();
                    return new SeriesItem(category, seriesType, colors.get(category), points);
                })
                .toList());

        // calculate totals
        if (totalColor != null) {
            List<DataPoint> totalPoints = months.stream()
                    .map(month -> {
                        BigDecimal total = results.stream()
                                .filter(r -> r.statYear() == month.getYear() && r.statMonth() == month.getMonthValue())
                                .map(MonthlyCategoryResult::totalAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
                        return new DataPoint(month.toString(), total, null);
                    })
                    .toList();
            series.addFirst(new SeriesItem(i18n.get("label.total"), "line", totalColor, totalPoints));
        }

        return new SeriesPayload(series);
    }

    public DistributionPayload buildCategoryAmountDistributionPayload(List<CategoryAmountResult> results) {
        List<DistributionItem> items = results.stream()
                .map(r -> new DistributionItem(r.categoryName(), r.totalAmount(), r.categoryColor()))
                .toList();
        return new DistributionPayload(items);
    }

    // --- UTILITIES ---

    public <T extends MonthlyResult> Optional<T> findByMonth(List<T> results, YearMonth month) {
        return results.stream()
                .filter(r -> r.statYear() == month.getYear() && r.statMonth() == month.getMonthValue())
                .findFirst();
    }

    public <T extends MonthlyResult> BigDecimal getAmount(
            List<T> results, YearMonth month, Function<T, BigDecimal> extractor) {
        return findByMonth(results, month).map(extractor).orElse(BigDecimal.ZERO);
    }

    public <T extends CategoryResult> Set<String> getCategories(List<T> results) {
        return results.stream().map(CategoryResult::categoryName).collect(Collectors.toSet());
    }

    public <T extends CategoryResult> Map<String, String> getCategoryColorMap(List<T> results) {
        return results.stream()
                .collect(Collectors.toMap(
                        CategoryResult::categoryName, CategoryResult::categoryColor, (a, b) -> a, LinkedHashMap::new));
    }

    public BigDecimal getCategoryAmountForMonth(List<MonthlyCategoryResult> results, String category, YearMonth month) {
        return results.stream()
                .filter(r -> r.categoryName().equals(category)
                        && r.statYear() == month.getYear()
                        && r.statMonth() == month.getMonthValue())
                .map(MonthlyCategoryResult::totalAmount)
                .findFirst()
                .orElse(BigDecimal.ZERO);
    }

    public BigDecimal calculateSavingsRate(BigDecimal income, BigDecimal expense) {
        if (income.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return income.subtract(expense)
                .divide(income, DIVISION_SCALE, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER))
                .setScale(DISPLAY_SCALE, RoundingMode.HALF_UP);
    }

    public BigDecimal toBigDecimal(Object value) {
        if (value instanceof BigDecimal bd) {
            return bd;
        }
        if (value instanceof Number n) {
            return new BigDecimal(n.toString());
        }
        return BigDecimal.ZERO;
    }

    // --- STAT CARD HELPERS ---

    public TrendResult computeTrend(
            WidgetRequest request,
            BigDecimal currentValue,
            BiFunction<LocalDate, LocalDate, BigDecimal> valueCalculator) {
        return doComputeTrend(request, currentValue, valueCalculator, this::calculateChangePercentage);
    }

    public TrendResult computeTrendByDifference(
            WidgetRequest request,
            BigDecimal currentValue,
            BiFunction<LocalDate, LocalDate, BigDecimal> valueCalculator) {
        return doComputeTrend(request, currentValue, valueCalculator, (prev, curr) -> curr.subtract(prev));
    }

    private TrendResult doComputeTrend(
            WidgetRequest request,
            BigDecimal currentValue,
            BiFunction<LocalDate, LocalDate, BigDecimal> valueCalculator,
            BiFunction<BigDecimal, BigDecimal, BigDecimal> changeCalculator) {
        Timeframe timeframe = request.timeframe();
        LocalDate prevStart = timeframe.previousPeriodStart(request.startDate());
        if (prevStart == null) {
            return TrendResult.NEUTRAL;
        }
        LocalDate prevEnd = timeframe.previousPeriodEnd(request.startDate(), request.endDate());
        BigDecimal prevValue = valueCalculator.apply(prevStart, prevEnd);
        BigDecimal change = changeCalculator.apply(prevValue, currentValue);
        return new TrendResult(change, determineTrend(change));
    }

    public StatCardPayload buildFrequencyStatCard(
            WidgetRequest request, long currentCount, BiFunction<LocalDate, LocalDate, Long> countCalculator) {
        long currentMonths = DateUtils.countMonths(request.startDate(), request.endDate());
        BigDecimal currentAvg = divideAsAvg(currentCount, currentMonths);
        String unitLabel = i18n.getUnitLabel(currentAvg, "unit.transaction", "unit.transactions");

        TrendResult trend = computeTrend(request, currentAvg, (s, e) -> {
            long prevCount = countCalculator.apply(s, e);
            long prevMonths = DateUtils.countMonths(s, e);
            return divideAsAvg(prevCount, prevMonths);
        });

        return new StatCardPayload(
                currentAvg,
                unitLabel,
                i18n.get("context.per-month"),
                trend.changePercentage(),
                trend.trend(),
                null,
                null);
    }

    public BigDecimal calculateChangePercentage(BigDecimal previous, BigDecimal current) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return current.subtract(previous)
                .divide(previous, DIVISION_SCALE, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(PERCENTAGE_MULTIPLIER))
                .setScale(DISPLAY_SCALE, RoundingMode.HALF_UP);
    }

    public Trend determineTrend(BigDecimal changePercentage) {
        int cmp = changePercentage.compareTo(BigDecimal.ZERO);
        if (cmp > 0) return Trend.UP;
        if (cmp < 0) return Trend.DOWN;
        return Trend.NEUTRAL;
    }

    public Map<TransactionType, BigDecimal> toTypeAmountMap(List<TypeAmountResult> projections) {
        return projections.stream().collect(Collectors.toMap(TypeAmountResult::type, TypeAmountResult::totalAmount));
    }

    public String getUserCurrencySymbol() {
        Long userId = userService.getCurrentUserId();
        SupportedCurrency currency = userSettingsRepository
                .findBaseCurrencyByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Settings not found for user " + userId));
        return i18n.getCurrencySymbol(currency);
    }

    private BigDecimal divideAsAvg(long count, long months) {
        return BigDecimal.valueOf(count).divide(BigDecimal.valueOf(months), 1, RoundingMode.HALF_UP);
    }
}
