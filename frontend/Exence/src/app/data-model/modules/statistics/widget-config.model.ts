import { TranslationCode } from '../../../shared/i18n/translation-types';
import { CategoryType } from '../category/CategoryType';
import { ExChartType } from './ChartType';

// name of each individual chart (can be multiple of a chart type - 3 bar charts with different data)
export enum StatisticsWidgetType {
	// Stat Cards
	EXPENSE_FREQUENCY_STATCARD = 'EXPENSE_FREQUENCY_STATCARD',
	INCOME_FREQUENCY_STATCARD = 'INCOME_FREQUENCY_STATCARD',
	NO_SPEND_DAYS_STATCARD = 'NO_SPEND_DAYS_STATCARD',
	TOP_EXPENSE_CATEGORY_STATCARD = 'TOP_EXPENSE_CATEGORY_STATCARD',
	TOP_INCOME_CATEGORY_STATCARD = 'TOP_INCOME_CATEGORY_STATCARD',
	TOP_EXPENSE_TRANSACTION_STATCARD = 'TOP_EXPENSE_TRANSACTION_STATCARD',
	TOP_INCOME_TRANSACTION_STATCARD = 'TOP_INCOME_TRANSACTION_STATCARD',
	BURN_RATE_STATCARD = 'BURN_RATE_STATCARD',
	SAVINGS_RATE_STATCARD = 'SAVINGS_RATE_STATCARD',

	// Area/Line trends
	INCOME_TREND = 'INCOME_TREND',
	EXPENSE_TREND = 'EXPENSE_TREND',
	BALANCE_TREND = 'BALANCE_TREND',
	INCOME_CATEGORY_TREND = 'INCOME_CATEGORY_TREND',
	EXPENSE_CATEGORY_TREND = 'EXPENSE_CATEGORY_TREND',
	BALANCE_YEAR_COMPARISON = 'BALANCE_YEAR_COMPARISON',

	// Column/Bar
	INCOME_EXPENSE_COLUMN = 'INCOME_EXPENSE_COLUMN',
	EXPENSE_CATEGORY_COLUMN = 'EXPENSE_CATEGORY_COLUMN',
	MONTHLY_BALANCE_COLUMN = 'MONTHLY_BALANCE_COLUMN',

	// Mixed
	EXPENSE_SAVINGS_COMBO = 'EXPENSE_SAVINGS_COMBO',
	TRANSACTION_COUNT_EXPENSE_COMBO = 'TRANSACTION_COUNT_EXPENSE_COMBO',
	WEALTH_GROWTH_COMBO = 'WEALTH_GROWTH_COMBO',

	// Pie/Donut
	EXPENSE_PIE = 'EXPENSE_PIE',
	INCOME_PIE = 'INCOME_PIE',

	// Radar
	SPENDING_RADAR = 'SPENDING_RADAR',
	MONTHLY_CATEGORY_RADAR = 'MONTHLY_CATEGORY_RADAR',

	// Polar Area
	CATEGORY_AVG_POLAR = 'CATEGORY_AVG_POLAR',
	MONTHLY_PEAK_POLAR = 'MONTHLY_PEAK_POLAR',

	// Bubble
	CATEGORY_BUBBLE = 'CATEGORY_BUBBLE',

	// Scatter
	TRANSACTION_SCATTER = 'TRANSACTION_SCATTER',

	// Heatmap
	SPENDING_HEATMAP = 'SPENDING_HEATMAP',

	// Treemap
	CATEGORY_TREEMAP = 'CATEGORY_TREEMAP',

	// Boxplot
	CATEGORY_BOXPLOT = 'CATEGORY_BOXPLOT',
	MONTHLY_BOXPLOT = 'MONTHLY_BOXPLOT',

	// Gauge
	SAVINGS_RATE_GAUGE = 'SAVINGS_RATE_GAUGE',

	// Slope
	YEARLY_SLOPE = 'YEARLY_SLOPE',

	// Sankey
	CATEGORY_SANKEY = 'CATEGORY_SANKEY',

	// Dashboard
	DASHBOARD_BALANCE_TREND = 'DASHBOARD_BALANCE_TREND',
}

export enum AdminWidgetType {
	DAILY_ACTIVE_USERS = 'DAILY_ACTIVE_USERS',
	MONTHLY_ACTIVE_USERS = 'MONTHLY_ACTIVE_USERS',
	TRANSACTION_VELOCITY = 'TRANSACTION_VELOCITY',
	DATABASE_GROWTH_SUMMARY = 'DATABASE_GROWTH_SUMMARY',
	CURRENCY_DISTRIBUTION = 'CURRENCY_DISTRIBUTION',
	AVG_TRANSACTIONS_PER_USER = 'AVG_TRANSACTIONS_PER_USER',
	TRANSACTION_TYPE_DISTRIBUTION = 'TRANSACTION_TYPE_DISTRIBUTION',
	TOP_ACTIVE_USERS = 'TOP_ACTIVE_USERS',
	EMAIL_VERIFICATION_RATE = 'EMAIL_VERIFICATION_RATE',
}

export enum GoalWidgetType {
	GOAL_ACTIVE_COUNT_STATCARD = 'GOAL_ACTIVE_COUNT_STATCARD',
	GOAL_AVG_PROGRESS_STATCARD = 'GOAL_AVG_PROGRESS_STATCARD',
	GOAL_COMPLETION_RATE_STATCARD = 'GOAL_COMPLETION_RATE_STATCARD',
	GOAL_NEXT_DEADLINE_STATCARD = 'GOAL_NEXT_DEADLINE_STATCARD',
	GOAL_PROGRESS_TREND = 'GOAL_PROGRESS_TREND',
	GOAL_TARGET_DISTRIBUTION_PIE = 'GOAL_TARGET_DISTRIBUTION_PIE',
	GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD = 'GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD',
	GOAL_TOTAL_SAVINGS_STATCARD = 'GOAL_TOTAL_SAVINGS_STATCARD',
}

export enum DebtWidgetType {
	DEBT_TOTAL_I_OWE_STATCARD = 'DEBT_TOTAL_I_OWE_STATCARD',
	DEBT_TOTAL_OWED_TO_ME_STATCARD = 'DEBT_TOTAL_OWED_TO_ME_STATCARD',
}

export enum InvestmentWidgetType {
	INVESTMENT_TOTAL_VALUE_STATCARD = 'INVESTMENT_TOTAL_VALUE_STATCARD',
	INVESTMENT_ASSET_COUNT_STATCARD = 'INVESTMENT_ASSET_COUNT_STATCARD',
}

/* eslint-disable-next-line complexity */
export function mapToExChartType(
	widgetType: StatisticsWidgetType | AdminWidgetType | GoalWidgetType | DebtWidgetType | InvestmentWidgetType,
): ExChartType {
	switch (widgetType) {
		case StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD:
		case StatisticsWidgetType.INCOME_FREQUENCY_STATCARD:
		case StatisticsWidgetType.NO_SPEND_DAYS_STATCARD:
		case StatisticsWidgetType.TOP_EXPENSE_CATEGORY_STATCARD:
		case StatisticsWidgetType.TOP_INCOME_CATEGORY_STATCARD:
		case StatisticsWidgetType.TOP_EXPENSE_TRANSACTION_STATCARD:
		case StatisticsWidgetType.TOP_INCOME_TRANSACTION_STATCARD:
		case StatisticsWidgetType.BURN_RATE_STATCARD:
		case StatisticsWidgetType.SAVINGS_RATE_STATCARD:
			return 'statCard';
		case StatisticsWidgetType.INCOME_TREND:
			return 'area';
		case StatisticsWidgetType.EXPENSE_TREND:
			return 'area';
		case StatisticsWidgetType.BALANCE_TREND:
			return 'area';
		case StatisticsWidgetType.INCOME_CATEGORY_TREND:
			return 'area';
		case StatisticsWidgetType.EXPENSE_CATEGORY_TREND:
			return 'area';
		case StatisticsWidgetType.BALANCE_YEAR_COMPARISON:
			return 'line';
		case StatisticsWidgetType.INCOME_EXPENSE_COLUMN:
			return 'bar';
		case StatisticsWidgetType.EXPENSE_CATEGORY_COLUMN:
			return 'bar';
		case StatisticsWidgetType.MONTHLY_BALANCE_COLUMN:
			return 'bar';
		case StatisticsWidgetType.EXPENSE_SAVINGS_COMBO:
			return 'line';
		case StatisticsWidgetType.TRANSACTION_COUNT_EXPENSE_COMBO:
			return 'line';
		case StatisticsWidgetType.WEALTH_GROWTH_COMBO:
			return 'line';
		case StatisticsWidgetType.EXPENSE_PIE:
			return 'donut';
		case StatisticsWidgetType.INCOME_PIE:
			return 'pie';
		case StatisticsWidgetType.SPENDING_RADAR:
			return 'radar';
		case StatisticsWidgetType.MONTHLY_CATEGORY_RADAR:
			return 'radar';
		case StatisticsWidgetType.CATEGORY_AVG_POLAR:
			return 'polarArea';
		case StatisticsWidgetType.MONTHLY_PEAK_POLAR:
			return 'polarArea';
		case StatisticsWidgetType.CATEGORY_BUBBLE:
			return 'bubble';
		case StatisticsWidgetType.TRANSACTION_SCATTER:
			return 'scatter';
		case StatisticsWidgetType.SPENDING_HEATMAP:
			return 'heatmap';
		case StatisticsWidgetType.CATEGORY_TREEMAP:
			return 'treemap';
		case StatisticsWidgetType.CATEGORY_BOXPLOT:
			return 'boxPlot';
		case StatisticsWidgetType.MONTHLY_BOXPLOT:
			return 'boxPlot';
		case StatisticsWidgetType.SAVINGS_RATE_GAUGE:
			return 'radialBar';
		case StatisticsWidgetType.YEARLY_SLOPE:
			return 'line';
		case StatisticsWidgetType.CATEGORY_SANKEY:
			return 'sankey';
		case StatisticsWidgetType.DASHBOARD_BALANCE_TREND:
			return 'area';
		case AdminWidgetType.AVG_TRANSACTIONS_PER_USER:
			return 'line';
		case AdminWidgetType.CURRENCY_DISTRIBUTION:
			return 'donut';
		case AdminWidgetType.DAILY_ACTIVE_USERS:
			return 'area';
		case AdminWidgetType.DATABASE_GROWTH_SUMMARY:
			return 'leaderboard';
		case AdminWidgetType.MONTHLY_ACTIVE_USERS:
			return 'bar';
		case AdminWidgetType.TOP_ACTIVE_USERS:
			return 'leaderboard';
		case AdminWidgetType.TRANSACTION_TYPE_DISTRIBUTION:
			return 'pie';
		case AdminWidgetType.TRANSACTION_VELOCITY:
			return 'bar';
		case AdminWidgetType.EMAIL_VERIFICATION_RATE:
			return 'statCard';
		case GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD:
		case GoalWidgetType.GOAL_AVG_PROGRESS_STATCARD:
		case GoalWidgetType.GOAL_COMPLETION_RATE_STATCARD:
		case GoalWidgetType.GOAL_NEXT_DEADLINE_STATCARD:
		case GoalWidgetType.GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD:
		case GoalWidgetType.GOAL_TOTAL_SAVINGS_STATCARD:
			return 'statCard';
		case GoalWidgetType.GOAL_PROGRESS_TREND:
			return 'area';
		case GoalWidgetType.GOAL_TARGET_DISTRIBUTION_PIE:
			return 'pie';
		case DebtWidgetType.DEBT_TOTAL_I_OWE_STATCARD:
		case DebtWidgetType.DEBT_TOTAL_OWED_TO_ME_STATCARD:
			return 'statCard';
		case InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD:
		case InvestmentWidgetType.INVESTMENT_ASSET_COUNT_STATCARD:
			return 'statCard';
	}
}

// Widget catalog data structures
export interface WidgetCatalogItem {
	type: StatisticsWidgetType;
	info: TranslationCode;
	title: TranslationCode;
	imgUrl: string;
}

export interface WidgetCatalogData {
	label: TranslationCode;
	group: WidgetCatalogGroup;
	widgets: WidgetCatalogItem[];
}

export type WidgetCatalogGroup = 'all' | 'line_area' | 'bar' | 'mixed' | 'circular' | 'point' | 'card' | 'other';

const GROUP_LABELS: Record<WidgetCatalogGroup, TranslationCode> = {
	all: 'statistics.catalog.groupLabels.all',
	card: 'statistics.catalog.groupLabels.card',
	line_area: 'statistics.catalog.groupLabels.lineArea',
	bar: 'statistics.catalog.groupLabels.bar',
	mixed: 'statistics.catalog.groupLabels.mixed',
	circular: 'statistics.catalog.groupLabels.circular',
	point: 'statistics.catalog.groupLabels.point',
	other: 'statistics.catalog.groupLabels.other',
};
const GROUP_ORDER: WidgetCatalogGroup[] = ['all', 'line_area', 'bar', 'mixed', 'circular', 'point', 'card', 'other'];

const WIDGET_METADATA: Partial<Record<StatisticsWidgetType, WidgetCatalogItem>> = {
	// Stat Cards
	[StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD]: {
		type: StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD,
		title: 'statistics.widget.EXPENSE_FREQUENCY_STATCARD.title',
		info: 'statistics.widget.EXPENSE_FREQUENCY_STATCARD.info',
		imgUrl: 'EXPENSE_FREQUENCY_STATCARD',
	},
	[StatisticsWidgetType.INCOME_FREQUENCY_STATCARD]: {
		type: StatisticsWidgetType.INCOME_FREQUENCY_STATCARD,
		title: 'statistics.widget.INCOME_FREQUENCY_STATCARD.title',
		info: 'statistics.widget.INCOME_FREQUENCY_STATCARD.info',
		imgUrl: 'INCOME_FREQUENCY_STATCARD',
	},
	[StatisticsWidgetType.NO_SPEND_DAYS_STATCARD]: {
		type: StatisticsWidgetType.NO_SPEND_DAYS_STATCARD,
		title: 'statistics.widget.NO_SPEND_DAYS_STATCARD.title',
		info: 'statistics.widget.NO_SPEND_DAYS_STATCARD.info',
		imgUrl: 'NO_SPEND_DAYS_STATCARD',
	},
	[StatisticsWidgetType.TOP_EXPENSE_CATEGORY_STATCARD]: {
		type: StatisticsWidgetType.TOP_EXPENSE_CATEGORY_STATCARD,
		title: 'statistics.widget.TOP_EXPENSE_CATEGORY_STATCARD.title',
		info: 'statistics.widget.TOP_EXPENSE_CATEGORY_STATCARD.info',
		imgUrl: 'TOP_EXPENSE_CATEGORY_STATCARD',
	},
	[StatisticsWidgetType.TOP_INCOME_CATEGORY_STATCARD]: {
		type: StatisticsWidgetType.TOP_INCOME_CATEGORY_STATCARD,
		title: 'statistics.widget.TOP_INCOME_CATEGORY_STATCARD.title',
		info: 'statistics.widget.TOP_INCOME_CATEGORY_STATCARD.info',
		imgUrl: 'TOP_INCOME_CATEGORY_STATCARD',
	},
	[StatisticsWidgetType.TOP_EXPENSE_TRANSACTION_STATCARD]: {
		type: StatisticsWidgetType.TOP_EXPENSE_TRANSACTION_STATCARD,
		title: 'statistics.widget.TOP_EXPENSE_TRANSACTION_STATCARD.title',
		info: 'statistics.widget.TOP_EXPENSE_TRANSACTION_STATCARD.info',
		imgUrl: 'TOP_EXPENSE_TRANSACTION_STATCARD',
	},
	[StatisticsWidgetType.TOP_INCOME_TRANSACTION_STATCARD]: {
		type: StatisticsWidgetType.TOP_INCOME_TRANSACTION_STATCARD,
		title: 'statistics.widget.TOP_INCOME_TRANSACTION_STATCARD.title',
		info: 'statistics.widget.TOP_INCOME_TRANSACTION_STATCARD.info',
		imgUrl: 'TOP_INCOME_TRANSACTION_STATCARD',
	},
	[StatisticsWidgetType.BURN_RATE_STATCARD]: {
		type: StatisticsWidgetType.BURN_RATE_STATCARD,
		title: 'statistics.widget.BURN_RATE_STATCARD.title',
		info: 'statistics.widget.BURN_RATE_STATCARD.info',
		imgUrl: 'BURN_RATE_STATCARD',
	},
	[StatisticsWidgetType.SAVINGS_RATE_STATCARD]: {
		type: StatisticsWidgetType.SAVINGS_RATE_STATCARD,
		title: 'statistics.widget.SAVINGS_RATE_STATCARD.title',
		info: 'statistics.widget.SAVINGS_RATE_STATCARD.info',
		imgUrl: 'SAVINGS_RATE_STATCARD',
	},

	// Area/Line trends
	[StatisticsWidgetType.INCOME_TREND]: {
		type: StatisticsWidgetType.INCOME_TREND,
		title: 'statistics.widget.INCOME_TREND.title',
		info: 'statistics.widget.INCOME_TREND.info',
		imgUrl: 'INCOME_TREND',
	},
	[StatisticsWidgetType.EXPENSE_TREND]: {
		type: StatisticsWidgetType.EXPENSE_TREND,
		title: 'statistics.widget.EXPENSE_TREND.title',
		info: 'statistics.widget.EXPENSE_TREND.info',
		imgUrl: 'EXPENSE_TREND',
	},
	[StatisticsWidgetType.BALANCE_TREND]: {
		type: StatisticsWidgetType.BALANCE_TREND,
		title: 'statistics.widget.BALANCE_TREND.title',
		info: 'statistics.widget.BALANCE_TREND.info',
		imgUrl: 'BALANCE_TREND',
	},
	[StatisticsWidgetType.INCOME_CATEGORY_TREND]: {
		type: StatisticsWidgetType.INCOME_CATEGORY_TREND,
		title: 'statistics.widget.INCOME_CATEGORY_TREND.title',
		info: 'statistics.widget.INCOME_CATEGORY_TREND.info',
		imgUrl: 'INCOME_CATEGORY_TREND',
	},
	[StatisticsWidgetType.EXPENSE_CATEGORY_TREND]: {
		type: StatisticsWidgetType.EXPENSE_CATEGORY_TREND,
		title: 'statistics.widget.EXPENSE_CATEGORY_TREND.title',
		info: 'statistics.widget.EXPENSE_CATEGORY_TREND.info',
		imgUrl: 'EXPENSE_CATEGORY_TREND',
	},
	[StatisticsWidgetType.BALANCE_YEAR_COMPARISON]: {
		type: StatisticsWidgetType.BALANCE_YEAR_COMPARISON,
		title: 'statistics.widget.BALANCE_YEAR_COMPARISON.title',
		info: 'statistics.widget.BALANCE_YEAR_COMPARISON.info',
		imgUrl: 'BALANCE_YEAR_COMPARISON',
	},

	// Column/Bar
	[StatisticsWidgetType.INCOME_EXPENSE_COLUMN]: {
		type: StatisticsWidgetType.INCOME_EXPENSE_COLUMN,
		title: 'statistics.widget.INCOME_EXPENSE_COLUMN.title',
		info: 'statistics.widget.INCOME_EXPENSE_COLUMN.info',
		imgUrl: 'INCOME_EXPENSE_COLUMN',
	},
	[StatisticsWidgetType.EXPENSE_CATEGORY_COLUMN]: {
		type: StatisticsWidgetType.EXPENSE_CATEGORY_COLUMN,
		title: 'statistics.widget.EXPENSE_CATEGORY_COLUMN.title',
		info: 'statistics.widget.EXPENSE_CATEGORY_COLUMN.info',
		imgUrl: 'EXPENSE_CATEGORY_COLUMN',
	},
	[StatisticsWidgetType.MONTHLY_BALANCE_COLUMN]: {
		type: StatisticsWidgetType.MONTHLY_BALANCE_COLUMN,
		title: 'statistics.widget.MONTHLY_BALANCE_COLUMN.title',
		info: 'statistics.widget.MONTHLY_BALANCE_COLUMN.info',
		imgUrl: 'MONTHLY_BALANCE_COLUMN',
	},

	// Mixed
	[StatisticsWidgetType.EXPENSE_SAVINGS_COMBO]: {
		type: StatisticsWidgetType.EXPENSE_SAVINGS_COMBO,
		title: 'statistics.widget.EXPENSE_SAVINGS_COMBO.title',
		info: 'statistics.widget.EXPENSE_SAVINGS_COMBO.info',
		imgUrl: 'EXPENSE_SAVINGS_COMBO',
	},
	[StatisticsWidgetType.TRANSACTION_COUNT_EXPENSE_COMBO]: {
		type: StatisticsWidgetType.TRANSACTION_COUNT_EXPENSE_COMBO,
		title: 'statistics.widget.TRANSACTION_COUNT_EXPENSE_COMBO.title',
		info: 'statistics.widget.TRANSACTION_COUNT_EXPENSE_COMBO.info',
		imgUrl: 'TRANSACTION_COUNT_EXPENSE_COMBO',
	},
	[StatisticsWidgetType.WEALTH_GROWTH_COMBO]: {
		type: StatisticsWidgetType.WEALTH_GROWTH_COMBO,
		title: 'statistics.widget.WEALTH_GROWTH_COMBO.title',
		info: 'statistics.widget.WEALTH_GROWTH_COMBO.info',
		imgUrl: 'WEALTH_GROWTH_COMBO',
	},

	// Pie/Donut
	[StatisticsWidgetType.EXPENSE_PIE]: {
		type: StatisticsWidgetType.EXPENSE_PIE,
		title: 'statistics.widget.EXPENSE_PIE.title',
		info: 'statistics.widget.EXPENSE_PIE.info',
		imgUrl: 'EXPENSE_PIE',
	},
	[StatisticsWidgetType.INCOME_PIE]: {
		type: StatisticsWidgetType.INCOME_PIE,
		title: 'statistics.widget.INCOME_PIE.title',
		info: 'statistics.widget.INCOME_PIE.info',
		imgUrl: 'INCOME_PIE',
	},

	// Radar
	[StatisticsWidgetType.SPENDING_RADAR]: {
		type: StatisticsWidgetType.SPENDING_RADAR,
		title: 'statistics.widget.SPENDING_RADAR.title',
		info: 'statistics.widget.SPENDING_RADAR.info',
		imgUrl: 'SPENDING_RADAR',
	},
	[StatisticsWidgetType.MONTHLY_CATEGORY_RADAR]: {
		type: StatisticsWidgetType.MONTHLY_CATEGORY_RADAR,
		title: 'statistics.widget.MONTHLY_CATEGORY_RADAR.title',
		info: 'statistics.widget.MONTHLY_CATEGORY_RADAR.info',
		imgUrl: 'MONTHLY_CATEGORY_RADAR',
	},

	// Polar Area
	[StatisticsWidgetType.CATEGORY_AVG_POLAR]: {
		type: StatisticsWidgetType.CATEGORY_AVG_POLAR,
		title: 'statistics.widget.CATEGORY_AVG_POLAR.title',
		info: 'statistics.widget.CATEGORY_AVG_POLAR.info',
		imgUrl: 'CATEGORY_AVG_POLAR',
	},
	[StatisticsWidgetType.MONTHLY_PEAK_POLAR]: {
		type: StatisticsWidgetType.MONTHLY_PEAK_POLAR,
		title: 'statistics.widget.MONTHLY_PEAK_POLAR.title',
		info: 'statistics.widget.MONTHLY_PEAK_POLAR.info',
		imgUrl: 'MONTHLY_PEAK_POLAR',
	},

	// Bubble
	[StatisticsWidgetType.CATEGORY_BUBBLE]: {
		type: StatisticsWidgetType.CATEGORY_BUBBLE,
		title: 'statistics.widget.CATEGORY_BUBBLE.title',
		info: 'statistics.widget.CATEGORY_BUBBLE.info',
		imgUrl: 'CATEGORY_BUBBLE',
	},

	// Scatter
	[StatisticsWidgetType.TRANSACTION_SCATTER]: {
		type: StatisticsWidgetType.TRANSACTION_SCATTER,
		title: 'statistics.widget.TRANSACTION_SCATTER.title',
		info: 'statistics.widget.TRANSACTION_SCATTER.info',
		imgUrl: 'TRANSACTION_SCATTER',
	},

	// Heatmap
	[StatisticsWidgetType.SPENDING_HEATMAP]: {
		type: StatisticsWidgetType.SPENDING_HEATMAP,
		title: 'statistics.widget.SPENDING_HEATMAP.title',
		info: 'statistics.widget.SPENDING_HEATMAP.info',
		imgUrl: 'SPENDING_HEATMAP',
	},

	// Treemap
	[StatisticsWidgetType.CATEGORY_TREEMAP]: {
		type: StatisticsWidgetType.CATEGORY_TREEMAP,
		title: 'statistics.widget.CATEGORY_TREEMAP.title',
		info: 'statistics.widget.CATEGORY_TREEMAP.info',
		imgUrl: 'CATEGORY_TREEMAP',
	},

	// Boxplot
	[StatisticsWidgetType.CATEGORY_BOXPLOT]: {
		type: StatisticsWidgetType.CATEGORY_BOXPLOT,
		title: 'statistics.widget.CATEGORY_BOXPLOT.title',
		info: 'statistics.widget.CATEGORY_BOXPLOT.info',
		imgUrl: 'CATEGORY_BOXPLOT',
	},
	[StatisticsWidgetType.MONTHLY_BOXPLOT]: {
		type: StatisticsWidgetType.MONTHLY_BOXPLOT,
		title: 'statistics.widget.MONTHLY_BOXPLOT.title',
		info: 'statistics.widget.MONTHLY_BOXPLOT.info',
		imgUrl: 'MONTHLY_BOXPLOT',
	},

	// Gauge
	[StatisticsWidgetType.SAVINGS_RATE_GAUGE]: {
		type: StatisticsWidgetType.SAVINGS_RATE_GAUGE,
		title: 'statistics.widget.SAVINGS_RATE_GAUGE.title',
		info: 'statistics.widget.SAVINGS_RATE_GAUGE.info',
		imgUrl: 'SAVINGS_RATE_GAUGE',
	},

	// Slope
	[StatisticsWidgetType.YEARLY_SLOPE]: {
		type: StatisticsWidgetType.YEARLY_SLOPE,
		title: 'statistics.widget.YEARLY_SLOPE.title',
		info: 'statistics.widget.YEARLY_SLOPE.info',
		imgUrl: 'YEARLY_SLOPE',
	},

	// Sankey
	[StatisticsWidgetType.CATEGORY_SANKEY]: {
		type: StatisticsWidgetType.CATEGORY_SANKEY,
		title: 'statistics.widget.CATEGORY_SANKEY.title',
		info: 'statistics.widget.CATEGORY_SANKEY.info',
		imgUrl: 'CATEGORY_SANKEY',
	},
};

export const GROUP_WIDGET_TYPES: Record<WidgetCatalogGroup, StatisticsWidgetType[]> = {
	all: Object.values(StatisticsWidgetType).filter(type => type in WIDGET_METADATA),
	card: [
		StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD,
		StatisticsWidgetType.INCOME_FREQUENCY_STATCARD,
		StatisticsWidgetType.NO_SPEND_DAYS_STATCARD,
		StatisticsWidgetType.TOP_EXPENSE_CATEGORY_STATCARD,
		StatisticsWidgetType.TOP_INCOME_CATEGORY_STATCARD,
		StatisticsWidgetType.TOP_EXPENSE_TRANSACTION_STATCARD,
		StatisticsWidgetType.TOP_INCOME_TRANSACTION_STATCARD,
		StatisticsWidgetType.BURN_RATE_STATCARD,
		StatisticsWidgetType.SAVINGS_RATE_STATCARD,
	],
	line_area: [
		StatisticsWidgetType.INCOME_TREND,
		StatisticsWidgetType.EXPENSE_TREND,
		StatisticsWidgetType.BALANCE_TREND,
		StatisticsWidgetType.INCOME_CATEGORY_TREND,
		StatisticsWidgetType.EXPENSE_CATEGORY_TREND,
		StatisticsWidgetType.BALANCE_YEAR_COMPARISON,
	],
	bar: [
		StatisticsWidgetType.INCOME_EXPENSE_COLUMN,
		StatisticsWidgetType.EXPENSE_CATEGORY_COLUMN,
		StatisticsWidgetType.MONTHLY_BALANCE_COLUMN,
	],
	mixed: [
		StatisticsWidgetType.EXPENSE_SAVINGS_COMBO,
		StatisticsWidgetType.TRANSACTION_COUNT_EXPENSE_COMBO,
		StatisticsWidgetType.WEALTH_GROWTH_COMBO,
	],
	circular: [
		StatisticsWidgetType.EXPENSE_PIE,
		StatisticsWidgetType.INCOME_PIE,
		StatisticsWidgetType.SPENDING_RADAR,
		StatisticsWidgetType.MONTHLY_CATEGORY_RADAR,
		StatisticsWidgetType.CATEGORY_AVG_POLAR,
		StatisticsWidgetType.MONTHLY_PEAK_POLAR,
	],
	point: [
		StatisticsWidgetType.CATEGORY_BUBBLE,
		StatisticsWidgetType.TRANSACTION_SCATTER,
		StatisticsWidgetType.YEARLY_SLOPE,
	],
	other: [
		StatisticsWidgetType.SPENDING_HEATMAP,
		StatisticsWidgetType.CATEGORY_TREEMAP,
		StatisticsWidgetType.CATEGORY_BOXPLOT,
		StatisticsWidgetType.MONTHLY_BOXPLOT,
		StatisticsWidgetType.SAVINGS_RATE_GAUGE,
		StatisticsWidgetType.CATEGORY_SANKEY,
	],
};

export const WIDGET_CATALOG: WidgetCatalogData[] = GROUP_ORDER.map(group => ({
	group,
	label: GROUP_LABELS[group],
	widgets: GROUP_WIDGET_TYPES[group].filter(type => type in WIDGET_METADATA).map(type => WIDGET_METADATA[type]!),
}));

export const WIDGET_CATEGORY_TYPES: Partial<Record<StatisticsWidgetType, CategoryType[]>> = {
	[StatisticsWidgetType.INCOME_TREND]: [CategoryType.INCOME],
	[StatisticsWidgetType.EXPENSE_TREND]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.BALANCE_TREND]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.INCOME_CATEGORY_TREND]: [CategoryType.INCOME],
	[StatisticsWidgetType.EXPENSE_CATEGORY_TREND]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.BALANCE_YEAR_COMPARISON]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.INCOME_EXPENSE_COLUMN]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.EXPENSE_CATEGORY_COLUMN]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.MONTHLY_BALANCE_COLUMN]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.EXPENSE_SAVINGS_COMBO]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.TRANSACTION_COUNT_EXPENSE_COMBO]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.WEALTH_GROWTH_COMBO]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.EXPENSE_PIE]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.INCOME_PIE]: [CategoryType.INCOME],
	[StatisticsWidgetType.SPENDING_RADAR]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.MONTHLY_CATEGORY_RADAR]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.CATEGORY_AVG_POLAR]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.MONTHLY_PEAK_POLAR]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.CATEGORY_BUBBLE]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.TRANSACTION_SCATTER]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.SPENDING_HEATMAP]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.CATEGORY_TREEMAP]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.CATEGORY_BOXPLOT]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.MONTHLY_BOXPLOT]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.YEARLY_SLOPE]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.CATEGORY_SANKEY]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[StatisticsWidgetType.EXPENSE_FREQUENCY_STATCARD]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.INCOME_FREQUENCY_STATCARD]: [CategoryType.INCOME],
	[StatisticsWidgetType.NO_SPEND_DAYS_STATCARD]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.TOP_EXPENSE_CATEGORY_STATCARD]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.TOP_INCOME_CATEGORY_STATCARD]: [CategoryType.INCOME],
	[StatisticsWidgetType.TOP_EXPENSE_TRANSACTION_STATCARD]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.TOP_INCOME_TRANSACTION_STATCARD]: [CategoryType.INCOME],
	[StatisticsWidgetType.BURN_RATE_STATCARD]: [CategoryType.EXPENSE],
	[StatisticsWidgetType.SAVINGS_RATE_STATCARD]: [CategoryType.INCOME],
};

export const CATEGORY_FILTERABLE_WIDGET_TYPES: StatisticsWidgetType[] = Object.keys(
	WIDGET_CATEGORY_TYPES,
) as StatisticsWidgetType[];

export const TIMEFRAME_HIDDEN_WIDGET_TYPES: StatisticsWidgetType[] = [StatisticsWidgetType.SPENDING_HEATMAP];

// ADMIN
export const ADMIN_LEADERBOARD_CARDS: AdminWidgetType[] = [
	AdminWidgetType.DATABASE_GROWTH_SUMMARY,
	AdminWidgetType.TOP_ACTIVE_USERS,
	AdminWidgetType.EMAIL_VERIFICATION_RATE,
];

export const ADMIN_CHART_TYPES: AdminWidgetType[] = Object.values(AdminWidgetType).filter(
	t => !ADMIN_LEADERBOARD_CARDS.includes(t),
);

export const ADMIN_CHART_TITLES: Record<AdminWidgetType, TranslationCode> = {
	[AdminWidgetType.DAILY_ACTIVE_USERS]: 'admin.statistics.chart.DAILY_ACTIVE_USERS',
	[AdminWidgetType.MONTHLY_ACTIVE_USERS]: 'admin.statistics.chart.MONTHLY_ACTIVE_USERS',
	[AdminWidgetType.TRANSACTION_VELOCITY]: 'admin.statistics.chart.TRANSACTION_VELOCITY',
	[AdminWidgetType.CURRENCY_DISTRIBUTION]: 'admin.statistics.chart.CURRENCY_DISTRIBUTION',
	[AdminWidgetType.AVG_TRANSACTIONS_PER_USER]: 'admin.statistics.chart.AVG_TRANSACTIONS_PER_USER',
	[AdminWidgetType.TRANSACTION_TYPE_DISTRIBUTION]: 'admin.statistics.chart.TRANSACTION_TYPE_DISTRIBUTION',
	[AdminWidgetType.DATABASE_GROWTH_SUMMARY]: 'admin.statistics.leaderboard.DATABASE_GROWTH_SUMMARY',
	[AdminWidgetType.TOP_ACTIVE_USERS]: 'admin.statistics.leaderboard.TOP_ACTIVE_USERS',
	[AdminWidgetType.EMAIL_VERIFICATION_RATE]: 'admin.statistics.card.title',
};

export const ADMIN_LEADERBOARD_CARD_DATA: Partial<Record<AdminWidgetType, TranslationCode>> = {
	[AdminWidgetType.DATABASE_GROWTH_SUMMARY]: 'admin.statistics.leaderboard.DATABASE_GROWTH_SUMMARY',
	[AdminWidgetType.TOP_ACTIVE_USERS]: 'admin.statistics.leaderboard.TOP_ACTIVE_USERS',
};

// Goals
type GOAL_STATISTICS_GROUP = 'all' | 'card' | 'chart';

export const GOAL_GROUP_WIDGET_TYPES: Record<GOAL_STATISTICS_GROUP, GoalWidgetType[]> = {
	all: Object.values(GoalWidgetType),
	card: [
		GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD,
		GoalWidgetType.GOAL_AVG_PROGRESS_STATCARD,
		GoalWidgetType.GOAL_COMPLETION_RATE_STATCARD,
		GoalWidgetType.GOAL_NEXT_DEADLINE_STATCARD,
		GoalWidgetType.GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD,
		GoalWidgetType.GOAL_TOTAL_SAVINGS_STATCARD,
	],
	chart: [GoalWidgetType.GOAL_PROGRESS_TREND, GoalWidgetType.GOAL_TARGET_DISTRIBUTION_PIE],
};

export const GOAL_WIDGET_TITLES: Record<GoalWidgetType, TranslationCode> = {
	[GoalWidgetType.GOAL_ACTIVE_COUNT_STATCARD]: 'goals.statistics.card.GOAL_ACTIVE_COUNT_STATCARD',
	[GoalWidgetType.GOAL_AVG_PROGRESS_STATCARD]: 'goals.statistics.card.GOAL_AVG_PROGRESS_STATCARD',
	[GoalWidgetType.GOAL_COMPLETION_RATE_STATCARD]: 'goals.statistics.card.GOAL_COMPLETION_RATE_STATCARD',
	[GoalWidgetType.GOAL_NEXT_DEADLINE_STATCARD]: 'goals.statistics.card.GOAL_NEXT_DEADLINE_STATCARD',
	[GoalWidgetType.GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD]: 'goals.statistics.card.GOAL_TOTAL_SAVED_THIS_YEAR_STATCARD',
	[GoalWidgetType.GOAL_TOTAL_SAVINGS_STATCARD]: 'goals.statistics.card.GOAL_TOTAL_SAVINGS_STATCARD',
	[GoalWidgetType.GOAL_PROGRESS_TREND]: 'goals.statistics.chart.GOAL_PROGRESS_TREND',
	[GoalWidgetType.GOAL_TARGET_DISTRIBUTION_PIE]: 'goals.statistics.chart.GOAL_TARGET_DISTRIBUTION_PIE',
};

// Debts
type DEBT_STATISTICS_GROUP = 'all' | 'card';

export const DEBT_GROUP_WIDGET_TYPES: Record<DEBT_STATISTICS_GROUP, DebtWidgetType[]> = {
	all: Object.values(DebtWidgetType),
	card: [DebtWidgetType.DEBT_TOTAL_I_OWE_STATCARD, DebtWidgetType.DEBT_TOTAL_OWED_TO_ME_STATCARD],
};

export const DEBT_WIDGET_TITLES: Record<DebtWidgetType, TranslationCode> = {
	[DebtWidgetType.DEBT_TOTAL_I_OWE_STATCARD]: 'debts.statistics.card.DEBT_TOTAL_I_OWE_STATCARD',
	[DebtWidgetType.DEBT_TOTAL_OWED_TO_ME_STATCARD]: 'debts.statistics.card.DEBT_TOTAL_OWED_TO_ME_STATCARD',
};

// Investments
type INVESTMENT_STATISTICS_GROUP = 'all' | 'card';

export const INVESTMENT_GROUP_WIDGET_TYPES: Record<INVESTMENT_STATISTICS_GROUP, InvestmentWidgetType[]> = {
	all: Object.values(InvestmentWidgetType),
	card: [InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD, InvestmentWidgetType.INVESTMENT_ASSET_COUNT_STATCARD],
};

export const INVESTMENT_WIDGET_TITLES: Record<InvestmentWidgetType, TranslationCode> = {
	[InvestmentWidgetType.INVESTMENT_TOTAL_VALUE_STATCARD]:
		'investments.statistics.card.INVESTMENT_TOTAL_VALUE_STATCARD',
	[InvestmentWidgetType.INVESTMENT_ASSET_COUNT_STATCARD]:
		'investments.statistics.card.INVESTMENT_ASSET_COUNT_STATCARD',
};
