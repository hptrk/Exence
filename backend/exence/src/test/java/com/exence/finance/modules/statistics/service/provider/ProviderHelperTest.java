package com.exence.finance.modules.statistics.service.provider;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

import com.exence.finance.common.dto.SupportedCurrency;
import com.exence.finance.common.i18n.I18nService;
import com.exence.finance.modules.statistics.dto.StatisticsWidgetType;
import com.exence.finance.modules.statistics.dto.Timeframe;
import com.exence.finance.modules.statistics.dto.WidgetRequest;
import com.exence.finance.modules.statistics.dto.payload.DistributionPayload;
import com.exence.finance.modules.statistics.dto.payload.SeriesPayload;
import com.exence.finance.modules.statistics.dto.payload.StatCardPayload;
import com.exence.finance.modules.statistics.dto.payload.Trend;
import com.exence.finance.modules.statistics.dto.result.CategoryAmountResult;
import com.exence.finance.modules.statistics.dto.result.MonthlyCategoryResult;
import com.exence.finance.modules.statistics.dto.result.TypeAmountResult;
import com.exence.finance.modules.transaction.dto.TransactionType;
import com.exence.finance.modules.workspace.context.WorkspaceContextHolder;
import com.exence.finance.modules.workspace.repository.WorkspaceSettingsRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProviderHelperTest {

    @Mock
    private I18nService i18n;

    @Mock
    private WorkspaceSettingsRepository workspaceSettingsRepository;

    @InjectMocks
    private ProviderHelper providerHelper;

    private static final YearMonth JAN_2025 = YearMonth.of(2025, 1);
    private static final YearMonth FEB_2025 = YearMonth.of(2025, 2);

    @BeforeEach
    void setUp() {
        WorkspaceContextHolder.setWorkspaceId(1L);
    }

    @AfterEach
    void tearDown() {
        WorkspaceContextHolder.clear();
    }

    @Test
    @DisplayName("builds category series only when no total color is provided")
    void buildMonthlyCategorySeriesPayload_withoutTotal() {
        // given
        List<MonthlyCategoryResult> results = List.of(
                new MonthlyCategoryResult("Food", "#FF0000", 2025, 1, new BigDecimal("100")),
                new MonthlyCategoryResult("Food", "#FF0000", 2025, 2, new BigDecimal("200")));
        List<YearMonth> months = List.of(JAN_2025, FEB_2025);

        // when
        SeriesPayload payload = providerHelper.buildMonthlyCategorySeriesPayload(
                results, months, "bar", null, StatisticsWidgetType.EXPENSE_CATEGORY_TREND);

        // then
        assertThat(payload.type()).isEqualTo(StatisticsWidgetType.EXPENSE_CATEGORY_TREND);
        assertThat(payload.series()).hasSize(1);
        assertThat(payload.series().getFirst().name()).isEqualTo("Food");
        assertThat(payload.series().getFirst().data()).hasSize(2);
    }

    @Test
    @DisplayName("prepends a total series when a total color is provided")
    void buildMonthlyCategorySeriesPayload_withTotal() {
        // given
        given(i18n.get("label.total")).willReturn("Total");
        List<MonthlyCategoryResult> results =
                List.of(new MonthlyCategoryResult("Food", "#FF0000", 2025, 1, new BigDecimal("100")));
        List<YearMonth> months = List.of(JAN_2025);

        // when
        SeriesPayload payload = providerHelper.buildMonthlyCategorySeriesPayload(
                results, months, "bar", "#000000", StatisticsWidgetType.EXPENSE_CATEGORY_TREND);

        // then
        assertThat(payload.series()).hasSize(2);
        assertThat(payload.series().get(0).name()).isEqualTo("Total");
        assertThat(payload.series().get(1).name()).isEqualTo("Food");
    }

    @Test
    @DisplayName("maps category amount results to distribution items correctly")
    void buildCategoryAmountDistributionPayload_mapsResults() {
        // given
        List<CategoryAmountResult> results = List.of(
                new CategoryAmountResult("Food", "#FF0000", "icon", new BigDecimal("300")),
                new CategoryAmountResult("Transport", "#00FF00", "icon2", new BigDecimal("150")));

        // when
        DistributionPayload payload =
                providerHelper.buildCategoryAmountDistributionPayload(results, StatisticsWidgetType.EXPENSE_PIE);

        // then
        assertThat(payload.type()).isEqualTo(StatisticsWidgetType.EXPENSE_PIE);
        assertThat(payload.data()).hasSize(2);
        assertThat(payload.data().getFirst().name()).isEqualTo("Food");
        assertThat(payload.data().getFirst().amount()).isEqualByComparingTo("300");
    }

    @Test
    @DisplayName("returns the matching result when the month is found")
    void findByMonth_found() {
        // given
        List<MonthlyCategoryResult> results =
                List.of(new MonthlyCategoryResult("Food", "#FF0000", 2025, 1, new BigDecimal("100")));

        // when
        Optional<MonthlyCategoryResult> found = providerHelper.findByMonth(results, JAN_2025);

        // then
        assertThat(found).isPresent();
        assertThat(found.get().categoryName()).isEqualTo("Food");
    }

    @Test
    @DisplayName("returns empty optional when the month is not found")
    void findByMonth_notFound() {
        // given
        List<MonthlyCategoryResult> results =
                List.of(new MonthlyCategoryResult("Food", "#FF0000", 2025, 1, new BigDecimal("100")));

        // when
        Optional<MonthlyCategoryResult> found = providerHelper.findByMonth(results, FEB_2025);

        // then
        assertThat(found).isEmpty();
    }

    @Test
    @DisplayName("returns the extracted value when the month entry is found")
    void getAmount_found() {
        // given
        List<MonthlyCategoryResult> results =
                List.of(new MonthlyCategoryResult("Food", "#FF0000", 2025, 1, new BigDecimal("100")));

        // when
        BigDecimal amount = providerHelper.getAmount(results, JAN_2025, MonthlyCategoryResult::totalAmount);

        // then
        assertThat(amount).isEqualByComparingTo("100");
    }

    @Test
    @DisplayName("returns zero when no matching month entry exists")
    void getAmount_notFound() {
        // when
        BigDecimal amount = providerHelper.getAmount(List.of(), JAN_2025, MonthlyCategoryResult::totalAmount);

        // then
        assertThat(amount).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("returns unique category names from the result list")
    void getCategories_returnsUniqueNames() {
        // given
        List<MonthlyCategoryResult> results = List.of(
                new MonthlyCategoryResult("Food", "#FF0000", 2025, 1, new BigDecimal("100")),
                new MonthlyCategoryResult("Food", "#FF0000", 2025, 2, new BigDecimal("200")),
                new MonthlyCategoryResult("Transport", "#00FF00", 2025, 1, new BigDecimal("50")));

        // when
        Set<String> categories = providerHelper.getCategories(results);

        // then
        assertThat(categories).containsExactlyInAnyOrder("Food", "Transport");
    }

    @Test
    @DisplayName("builds a name-to-color mapping from the result list")
    void getCategoryColorMap_buildsMapping() {
        // given
        List<MonthlyCategoryResult> results = List.of(
                new MonthlyCategoryResult("Food", "#FF0000", 2025, 1, new BigDecimal("100")),
                new MonthlyCategoryResult("Transport", "#00FF00", 2025, 1, new BigDecimal("50")));

        // when
        Map<String, String> colorMap = providerHelper.getCategoryColorMap(results);

        // then
        assertThat(colorMap).containsEntry("Food", "#FF0000").containsEntry("Transport", "#00FF00");
    }

    @Test
    @DisplayName("returns the category amount for a matching month entry")
    void getCategoryAmountForMonth_matchingEntry() {
        // given
        List<MonthlyCategoryResult> results = List.of(
                new MonthlyCategoryResult("Food", "#FF0000", 2025, 1, new BigDecimal("150")),
                new MonthlyCategoryResult("Transport", "#00FF00", 2025, 1, new BigDecimal("50")));

        // when
        BigDecimal amount = providerHelper.getCategoryAmountForMonth(results, "Food", JAN_2025);

        // then
        assertThat(amount).isEqualByComparingTo("150");
    }

    @Test
    @DisplayName("returns zero when no matching category and month entry exists")
    void getCategoryAmountForMonth_noMatch() {
        // when
        BigDecimal amount = providerHelper.getCategoryAmountForMonth(List.of(), "Food", JAN_2025);

        // then
        assertThat(amount).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("returns the correct savings rate for normal income and expense values")
    void calculateSavingsRate_normalIncome() {
        // given
        BigDecimal income = new BigDecimal("1000");
        BigDecimal expense = new BigDecimal("700");

        // when
        BigDecimal rate = providerHelper.calculateSavingsRate(income, expense);

        // then
        assertThat(rate).isEqualByComparingTo("30.00");
    }

    @Test
    @DisplayName("returns zero when income is zero")
    void calculateSavingsRate_zeroIncome() {
        // when
        BigDecimal rate = providerHelper.calculateSavingsRate(BigDecimal.ZERO, new BigDecimal("500"));

        // then
        assertThat(rate).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("returns the same BigDecimal value when input is already a BigDecimal")
    void toBigDecimal_bigDecimalInput() {
        BigDecimal value = new BigDecimal("123.45");
        assertThat(providerHelper.toBigDecimal(value)).isEqualByComparingTo(value);
    }

    @Test
    @DisplayName("converts an integer to its BigDecimal equivalent")
    void toBigDecimal_integerInput() {
        assertThat(providerHelper.toBigDecimal(42)).isEqualByComparingTo("42");
    }

    @Test
    @DisplayName("returns zero when the input is null")
    void toBigDecimal_nullInput() {
        assertThat(providerHelper.toBigDecimal(null)).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("returns zero change percentage when the previous value is zero")
    void calculateChangePercentage_zeroPrevious() {
        // when
        BigDecimal result = providerHelper.calculateChangePercentage(BigDecimal.ZERO, new BigDecimal("100"));

        // then
        assertThat(result).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("returns a positive percentage when the value increases")
    void calculateChangePercentage_increase() {
        // when
        BigDecimal result = providerHelper.calculateChangePercentage(new BigDecimal("100"), new BigDecimal("150"));

        // then
        assertThat(result).isEqualByComparingTo("50.00");
    }

    @Test
    @DisplayName("returns a negative percentage when the value decreases")
    void calculateChangePercentage_decrease() {
        // when
        BigDecimal result = providerHelper.calculateChangePercentage(new BigDecimal("100"), new BigDecimal("80"));

        // then
        assertThat(result).isEqualByComparingTo("-20.00");
    }

    @Test
    @DisplayName("returns UP trend when the change is positive")
    void determineTrend_positiveChange() {
        assertThat(providerHelper.determineTrend(new BigDecimal("10"))).isEqualTo(Trend.UP);
    }

    @Test
    @DisplayName("returns DOWN trend when the change is negative")
    void determineTrend_negativeChange() {
        assertThat(providerHelper.determineTrend(new BigDecimal("-5"))).isEqualTo(Trend.DOWN);
    }

    @Test
    @DisplayName("returns NEUTRAL trend when the change is zero")
    void determineTrend_zeroChange() {
        assertThat(providerHelper.determineTrend(BigDecimal.ZERO)).isEqualTo(Trend.NEUTRAL);
    }

    @Test
    @DisplayName("builds a transaction type to amount map from the projection list")
    void toTypeAmountMap_buildsMap() {
        // given
        List<TypeAmountResult> projections = List.of(
                new TypeAmountResult(TransactionType.INCOME, new BigDecimal("1000")),
                new TypeAmountResult(TransactionType.EXPENSE, new BigDecimal("700")));

        // when
        Map<TransactionType, BigDecimal> result = providerHelper.toTypeAmountMap(projections);

        // then
        assertThat(result).containsEntry(TransactionType.INCOME, new BigDecimal("1000"));
        assertThat(result).containsEntry(TransactionType.EXPENSE, new BigDecimal("700"));
    }

    @Test
    @DisplayName("returns NEUTRAL trend result when the timeframe is ALL_TIME")
    void computeTrend_allTimeTimeframe() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ALL_TIME, Map.of());

        // when
        TrendResult result =
                providerHelper.computeTrend(request, new BigDecimal("100"), (s, e) -> new BigDecimal("50"));

        // then
        assertThat(result).isEqualTo(TrendResult.NEUTRAL);
    }

    @Test
    @DisplayName("returns UP trend when current value is higher than the previous period")
    void computeTrend_currentHigherThanPrevious() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());

        // when
        TrendResult result =
                providerHelper.computeTrend(request, new BigDecimal("100"), (s, e) -> new BigDecimal("80"));

        // then
        assertThat(result.trend()).isEqualTo(Trend.UP);
    }

    @Test
    @DisplayName("returns DOWN trend when current value is lower than the previous period")
    void computeTrend_currentLowerThanPrevious() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());

        // when
        TrendResult result =
                providerHelper.computeTrend(request, new BigDecimal("80"), (s, e) -> new BigDecimal("100"));

        // then
        assertThat(result.trend()).isEqualTo(Trend.DOWN);
    }

    @Test
    @DisplayName("returns UP trend with positive change percentage when value increases")
    void computeTrendByDifference_increase() {
        // given
        WidgetRequest request =
                new WidgetRequest(LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31), Timeframe.ONE_MONTH, Map.of());

        // when
        TrendResult result =
                providerHelper.computeTrendByDifference(request, new BigDecimal("30"), (s, e) -> new BigDecimal("10"));

        // then
        assertThat(result.trend()).isEqualTo(Trend.UP);
        assertThat(result.changePercentage()).isEqualByComparingTo("20");
    }

    @Test
    @DisplayName("returns stat card payload with correct type, context label and unit")
    void buildFrequencyStatCard_returnsStatCard() {
        // given
        WidgetRequest request = new WidgetRequest(
                LocalDate.of(2025, 1, 1), LocalDate.of(2025, 3, 31), Timeframe.THREE_MONTHS, Map.of());
        given(i18n.getUnitLabel(any(), eq("unit.transaction"), eq("unit.transactions")))
                .willReturn("transactions");
        given(i18n.get("context.per-month")).willReturn("per month");

        // when
        StatCardPayload payload = providerHelper.buildFrequencyStatCard(
                request, 30L, (s, e) -> 25L, StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD);

        // then
        assertThat(payload.type()).isEqualTo(StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD);
        assertThat(payload.contextLabel()).isEqualTo("per month");
        assertThat(payload.unit()).isEqualTo("transactions");
    }

    @Test
    @DisplayName("returns the currency symbol for the workspace's base currency")
    void getUserCurrencySymbol_withWorkspaceContext() {
        // given
        given(workspaceSettingsRepository.findBaseCurrencyByWorkspaceId(1L))
                .willReturn(Optional.of(SupportedCurrency.EUR));
        given(i18n.getCurrencySymbol(SupportedCurrency.EUR)).willReturn("€");

        // when
        String symbol = providerHelper.getUserCurrencySymbol();

        // then
        assertThat(symbol).isEqualTo("€");
    }

    @Test
    @DisplayName("throws IllegalStateException when workspace settings are not found")
    void getUserCurrencySymbol_settingsNotFound() {
        // given
        given(workspaceSettingsRepository.findBaseCurrencyByWorkspaceId(1L)).willReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> providerHelper.getUserCurrencySymbol())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Settings not found for workspace");
    }
}
