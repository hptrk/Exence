import { TranslationCode } from '../../../shared/i18n/translation-types';
import { CategoryType } from '../category/CategoryType';
import { ExChartType } from './ChartType';

// name of each individual chart (can be multiple of a chart type - 3 bar charts with different data)
export enum WidgetType {
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
	widgetType: WidgetType | AdminWidgetType | GoalWidgetType | DebtWidgetType | InvestmentWidgetType,
): ExChartType {
	switch (widgetType) {
		case WidgetType.EXPENSE_FREQUENCY_STATCARD:
		case WidgetType.INCOME_FREQUENCY_STATCARD:
		case WidgetType.NO_SPEND_DAYS_STATCARD:
		case WidgetType.TOP_EXPENSE_CATEGORY_STATCARD:
		case WidgetType.TOP_INCOME_CATEGORY_STATCARD:
		case WidgetType.TOP_EXPENSE_TRANSACTION_STATCARD:
		case WidgetType.TOP_INCOME_TRANSACTION_STATCARD:
		case WidgetType.BURN_RATE_STATCARD:
		case WidgetType.SAVINGS_RATE_STATCARD:
			return 'statCard';
		case WidgetType.INCOME_TREND:
			return 'area';
		case WidgetType.EXPENSE_TREND:
			return 'area';
		case WidgetType.BALANCE_TREND:
			return 'area';
		case WidgetType.INCOME_CATEGORY_TREND:
			return 'area';
		case WidgetType.EXPENSE_CATEGORY_TREND:
			return 'area';
		case WidgetType.BALANCE_YEAR_COMPARISON:
			return 'line';
		case WidgetType.INCOME_EXPENSE_COLUMN:
			return 'bar';
		case WidgetType.EXPENSE_CATEGORY_COLUMN:
			return 'bar';
		case WidgetType.MONTHLY_BALANCE_COLUMN:
			return 'bar';
		case WidgetType.EXPENSE_SAVINGS_COMBO:
			return 'line';
		case WidgetType.TRANSACTION_COUNT_EXPENSE_COMBO:
			return 'line';
		case WidgetType.WEALTH_GROWTH_COMBO:
			return 'line';
		case WidgetType.EXPENSE_PIE:
			return 'donut';
		case WidgetType.INCOME_PIE:
			return 'pie';
		case WidgetType.SPENDING_RADAR:
			return 'radar';
		case WidgetType.MONTHLY_CATEGORY_RADAR:
			return 'radar';
		case WidgetType.CATEGORY_AVG_POLAR:
			return 'polarArea';
		case WidgetType.MONTHLY_PEAK_POLAR:
			return 'polarArea';
		case WidgetType.CATEGORY_BUBBLE:
			return 'bubble';
		case WidgetType.TRANSACTION_SCATTER:
			return 'scatter';
		case WidgetType.SPENDING_HEATMAP:
			return 'heatmap';
		case WidgetType.CATEGORY_TREEMAP:
			return 'treemap';
		case WidgetType.CATEGORY_BOXPLOT:
			return 'boxPlot';
		case WidgetType.MONTHLY_BOXPLOT:
			return 'boxPlot';
		case WidgetType.SAVINGS_RATE_GAUGE:
			return 'radialBar';
		case WidgetType.YEARLY_SLOPE:
			return 'line';
		case WidgetType.CATEGORY_SANKEY:
			return 'sankey';
		case WidgetType.DASHBOARD_BALANCE_TREND:
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
	type: WidgetType;
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

const WIDGET_METADATA: Partial<Record<WidgetType, WidgetCatalogItem>> = {
	// Stat Cards
	[WidgetType.EXPENSE_FREQUENCY_STATCARD]: {
		type: WidgetType.EXPENSE_FREQUENCY_STATCARD,
		title: 'statistics.widget.EXPENSE_FREQUENCY_STATCARD.title',
		info: 'statistics.widget.EXPENSE_FREQUENCY_STATCARD.info',
		imgUrl: 'EXPENSE_FREQUENCY_STATCARD',
	},
	[WidgetType.INCOME_FREQUENCY_STATCARD]: {
		type: WidgetType.INCOME_FREQUENCY_STATCARD,
		title: 'statistics.widget.INCOME_FREQUENCY_STATCARD.title',
		info: 'statistics.widget.INCOME_FREQUENCY_STATCARD.info',
		imgUrl: 'INCOME_FREQUENCY_STATCARD',
	},
	[WidgetType.NO_SPEND_DAYS_STATCARD]: {
		type: WidgetType.NO_SPEND_DAYS_STATCARD,
		title: 'statistics.widget.NO_SPEND_DAYS_STATCARD.title',
		info: 'statistics.widget.NO_SPEND_DAYS_STATCARD.info',
		imgUrl: 'NO_SPEND_DAYS_STATCARD',
	},
	[WidgetType.TOP_EXPENSE_CATEGORY_STATCARD]: {
		type: WidgetType.TOP_EXPENSE_CATEGORY_STATCARD,
		title: 'statistics.widget.TOP_EXPENSE_CATEGORY_STATCARD.title',
		info: 'statistics.widget.TOP_EXPENSE_CATEGORY_STATCARD.info',
		imgUrl: 'TOP_EXPENSE_CATEGORY_STATCARD',
	},
	[WidgetType.TOP_INCOME_CATEGORY_STATCARD]: {
		type: WidgetType.TOP_INCOME_CATEGORY_STATCARD,
		title: 'statistics.widget.TOP_INCOME_CATEGORY_STATCARD.title',
		info: 'statistics.widget.TOP_INCOME_CATEGORY_STATCARD.info',
		imgUrl: 'TOP_INCOME_CATEGORY_STATCARD',
	},
	[WidgetType.TOP_EXPENSE_TRANSACTION_STATCARD]: {
		type: WidgetType.TOP_EXPENSE_TRANSACTION_STATCARD,
		title: 'statistics.widget.TOP_EXPENSE_TRANSACTION_STATCARD.title',
		info: 'statistics.widget.TOP_EXPENSE_TRANSACTION_STATCARD.info',
		imgUrl: 'TOP_EXPENSE_TRANSACTION_STATCARD',
	},
	[WidgetType.TOP_INCOME_TRANSACTION_STATCARD]: {
		type: WidgetType.TOP_INCOME_TRANSACTION_STATCARD,
		title: 'statistics.widget.TOP_INCOME_TRANSACTION_STATCARD.title',
		info: 'statistics.widget.TOP_INCOME_TRANSACTION_STATCARD.info',
		imgUrl: 'TOP_INCOME_TRANSACTION_STATCARD',
	},
	[WidgetType.BURN_RATE_STATCARD]: {
		type: WidgetType.BURN_RATE_STATCARD,
		title: 'statistics.widget.BURN_RATE_STATCARD.title',
		info: 'statistics.widget.BURN_RATE_STATCARD.info',
		imgUrl: 'BURN_RATE_STATCARD',
	},
	[WidgetType.SAVINGS_RATE_STATCARD]: {
		type: WidgetType.SAVINGS_RATE_STATCARD,
		title: 'statistics.widget.SAVINGS_RATE_STATCARD.title',
		info: 'statistics.widget.SAVINGS_RATE_STATCARD.info',
		imgUrl: 'SAVINGS_RATE_STATCARD',
	},

	// Area/Line trends
	[WidgetType.INCOME_TREND]: {
		type: WidgetType.INCOME_TREND,
		title: 'statistics.widget.INCOME_TREND.title',
		info: 'statistics.widget.INCOME_TREND.info',
		imgUrl: 'INCOME_TREND',
	},
	[WidgetType.EXPENSE_TREND]: {
		type: WidgetType.EXPENSE_TREND,
		title: 'statistics.widget.EXPENSE_TREND.title',
		info: 'statistics.widget.EXPENSE_TREND.info',
		imgUrl: 'EXPENSE_TREND',
	},
	[WidgetType.BALANCE_TREND]: {
		type: WidgetType.BALANCE_TREND,
		title: 'statistics.widget.BALANCE_TREND.title',
		info: 'statistics.widget.BALANCE_TREND.info',
		imgUrl: 'BALANCE_TREND',
	},
	[WidgetType.INCOME_CATEGORY_TREND]: {
		type: WidgetType.INCOME_CATEGORY_TREND,
		title: 'statistics.widget.INCOME_CATEGORY_TREND.title',
		info: 'statistics.widget.INCOME_CATEGORY_TREND.info',
		imgUrl: 'INCOME_CATEGORY_TREND',
	},
	[WidgetType.EXPENSE_CATEGORY_TREND]: {
		type: WidgetType.EXPENSE_CATEGORY_TREND,
		title: 'statistics.widget.EXPENSE_CATEGORY_TREND.title',
		info: 'statistics.widget.EXPENSE_CATEGORY_TREND.info',
		imgUrl: 'EXPENSE_CATEGORY_TREND',
	},
	[WidgetType.BALANCE_YEAR_COMPARISON]: {
		type: WidgetType.BALANCE_YEAR_COMPARISON,
		title: 'statistics.widget.BALANCE_YEAR_COMPARISON.title',
		info: 'statistics.widget.BALANCE_YEAR_COMPARISON.info',
		imgUrl: 'BALANCE_YEAR_COMPARISON',
	},

	// Column/Bar
	[WidgetType.INCOME_EXPENSE_COLUMN]: {
		type: WidgetType.INCOME_EXPENSE_COLUMN,
		title: 'statistics.widget.INCOME_EXPENSE_COLUMN.title',
		info: 'statistics.widget.INCOME_EXPENSE_COLUMN.info',
		imgUrl: 'INCOME_EXPENSE_COLUMN',
	},
	[WidgetType.EXPENSE_CATEGORY_COLUMN]: {
		type: WidgetType.EXPENSE_CATEGORY_COLUMN,
		title: 'statistics.widget.EXPENSE_CATEGORY_COLUMN.title',
		info: 'statistics.widget.EXPENSE_CATEGORY_COLUMN.info',
		imgUrl: 'EXPENSE_CATEGORY_COLUMN',
	},
	[WidgetType.MONTHLY_BALANCE_COLUMN]: {
		type: WidgetType.MONTHLY_BALANCE_COLUMN,
		title: 'statistics.widget.MONTHLY_BALANCE_COLUMN.title',
		info: 'statistics.widget.MONTHLY_BALANCE_COLUMN.info',
		imgUrl: 'MONTHLY_BALANCE_COLUMN',
	},

	// Mixed
	[WidgetType.EXPENSE_SAVINGS_COMBO]: {
		type: WidgetType.EXPENSE_SAVINGS_COMBO,
		title: 'statistics.widget.EXPENSE_SAVINGS_COMBO.title',
		info: 'statistics.widget.EXPENSE_SAVINGS_COMBO.info',
		imgUrl: 'EXPENSE_SAVINGS_COMBO',
	},
	[WidgetType.TRANSACTION_COUNT_EXPENSE_COMBO]: {
		type: WidgetType.TRANSACTION_COUNT_EXPENSE_COMBO,
		title: 'statistics.widget.TRANSACTION_COUNT_EXPENSE_COMBO.title',
		info: 'statistics.widget.TRANSACTION_COUNT_EXPENSE_COMBO.info',
		imgUrl: 'TRANSACTION_COUNT_EXPENSE_COMBO',
	},
	[WidgetType.WEALTH_GROWTH_COMBO]: {
		type: WidgetType.WEALTH_GROWTH_COMBO,
		title: 'statistics.widget.WEALTH_GROWTH_COMBO.title',
		info: 'statistics.widget.WEALTH_GROWTH_COMBO.info',
		imgUrl: 'WEALTH_GROWTH_COMBO',
	},

	// Pie/Donut
	[WidgetType.EXPENSE_PIE]: {
		type: WidgetType.EXPENSE_PIE,
		title: 'statistics.widget.EXPENSE_PIE.title',
		info: 'statistics.widget.EXPENSE_PIE.info',
		imgUrl: 'EXPENSE_PIE',
	},
	[WidgetType.INCOME_PIE]: {
		type: WidgetType.INCOME_PIE,
		title: 'statistics.widget.INCOME_PIE.title',
		info: 'statistics.widget.INCOME_PIE.info',
		imgUrl: 'INCOME_PIE',
	},

	// Radar
	[WidgetType.SPENDING_RADAR]: {
		type: WidgetType.SPENDING_RADAR,
		title: 'statistics.widget.SPENDING_RADAR.title',
		info: 'statistics.widget.SPENDING_RADAR.info',
		imgUrl: 'SPENDING_RADAR',
	},
	[WidgetType.MONTHLY_CATEGORY_RADAR]: {
		type: WidgetType.MONTHLY_CATEGORY_RADAR,
		title: 'statistics.widget.MONTHLY_CATEGORY_RADAR.title',
		info: 'statistics.widget.MONTHLY_CATEGORY_RADAR.info',
		imgUrl: 'MONTHLY_CATEGORY_RADAR',
	},

	// Polar Area
	[WidgetType.CATEGORY_AVG_POLAR]: {
		type: WidgetType.CATEGORY_AVG_POLAR,
		title: 'statistics.widget.CATEGORY_AVG_POLAR.title',
		info: 'statistics.widget.CATEGORY_AVG_POLAR.info',
		imgUrl: 'CATEGORY_AVG_POLAR',
	},
	[WidgetType.MONTHLY_PEAK_POLAR]: {
		type: WidgetType.MONTHLY_PEAK_POLAR,
		title: 'statistics.widget.MONTHLY_PEAK_POLAR.title',
		info: 'statistics.widget.MONTHLY_PEAK_POLAR.info',
		imgUrl: 'MONTHLY_PEAK_POLAR',
	},

	// Bubble
	[WidgetType.CATEGORY_BUBBLE]: {
		type: WidgetType.CATEGORY_BUBBLE,
		title: 'statistics.widget.CATEGORY_BUBBLE.title',
		info: 'statistics.widget.CATEGORY_BUBBLE.info',
		imgUrl: 'CATEGORY_BUBBLE',
	},

	// Scatter
	[WidgetType.TRANSACTION_SCATTER]: {
		type: WidgetType.TRANSACTION_SCATTER,
		title: 'statistics.widget.TRANSACTION_SCATTER.title',
		info: 'statistics.widget.TRANSACTION_SCATTER.info',
		imgUrl: 'TRANSACTION_SCATTER',
	},

	// Heatmap
	[WidgetType.SPENDING_HEATMAP]: {
		type: WidgetType.SPENDING_HEATMAP,
		title: 'statistics.widget.SPENDING_HEATMAP.title',
		info: 'statistics.widget.SPENDING_HEATMAP.info',
		imgUrl: 'SPENDING_HEATMAP',
	},

	// Treemap
	[WidgetType.CATEGORY_TREEMAP]: {
		type: WidgetType.CATEGORY_TREEMAP,
		title: 'statistics.widget.CATEGORY_TREEMAP.title',
		info: 'statistics.widget.CATEGORY_TREEMAP.info',
		imgUrl: 'CATEGORY_TREEMAP',
	},

	// Boxplot
	[WidgetType.CATEGORY_BOXPLOT]: {
		type: WidgetType.CATEGORY_BOXPLOT,
		title: 'statistics.widget.CATEGORY_BOXPLOT.title',
		info: 'statistics.widget.CATEGORY_BOXPLOT.info',
		imgUrl: 'CATEGORY_BOXPLOT',
	},
	[WidgetType.MONTHLY_BOXPLOT]: {
		type: WidgetType.MONTHLY_BOXPLOT,
		title: 'statistics.widget.MONTHLY_BOXPLOT.title',
		info: 'statistics.widget.MONTHLY_BOXPLOT.info',
		imgUrl: 'MONTHLY_BOXPLOT',
	},

	// Gauge
	[WidgetType.SAVINGS_RATE_GAUGE]: {
		type: WidgetType.SAVINGS_RATE_GAUGE,
		title: 'statistics.widget.SAVINGS_RATE_GAUGE.title',
		info: 'statistics.widget.SAVINGS_RATE_GAUGE.info',
		imgUrl: 'SAVINGS_RATE_GAUGE',
	},

	// Slope
	[WidgetType.YEARLY_SLOPE]: {
		type: WidgetType.YEARLY_SLOPE,
		title: 'statistics.widget.YEARLY_SLOPE.title',
		info: 'statistics.widget.YEARLY_SLOPE.info',
		imgUrl: 'YEARLY_SLOPE',
	},

	// Sankey
	[WidgetType.CATEGORY_SANKEY]: {
		type: WidgetType.CATEGORY_SANKEY,
		title: 'statistics.widget.CATEGORY_SANKEY.title',
		info: 'statistics.widget.CATEGORY_SANKEY.info',
		imgUrl: 'CATEGORY_SANKEY',
	},
};

export const GROUP_WIDGET_TYPES: Record<WidgetCatalogGroup, WidgetType[]> = {
	all: Object.values(WidgetType).filter(type => type in WIDGET_METADATA),
	card: [
		WidgetType.EXPENSE_FREQUENCY_STATCARD,
		WidgetType.INCOME_FREQUENCY_STATCARD,
		WidgetType.NO_SPEND_DAYS_STATCARD,
		WidgetType.TOP_EXPENSE_CATEGORY_STATCARD,
		WidgetType.TOP_INCOME_CATEGORY_STATCARD,
		WidgetType.TOP_EXPENSE_TRANSACTION_STATCARD,
		WidgetType.TOP_INCOME_TRANSACTION_STATCARD,
		WidgetType.BURN_RATE_STATCARD,
		WidgetType.SAVINGS_RATE_STATCARD,
	],
	line_area: [
		WidgetType.INCOME_TREND,
		WidgetType.EXPENSE_TREND,
		WidgetType.BALANCE_TREND,
		WidgetType.INCOME_CATEGORY_TREND,
		WidgetType.EXPENSE_CATEGORY_TREND,
		WidgetType.BALANCE_YEAR_COMPARISON,
	],
	bar: [WidgetType.INCOME_EXPENSE_COLUMN, WidgetType.EXPENSE_CATEGORY_COLUMN, WidgetType.MONTHLY_BALANCE_COLUMN],
	mixed: [
		WidgetType.EXPENSE_SAVINGS_COMBO,
		WidgetType.TRANSACTION_COUNT_EXPENSE_COMBO,
		WidgetType.WEALTH_GROWTH_COMBO,
	],
	circular: [
		WidgetType.EXPENSE_PIE,
		WidgetType.INCOME_PIE,
		WidgetType.SPENDING_RADAR,
		WidgetType.MONTHLY_CATEGORY_RADAR,
		WidgetType.CATEGORY_AVG_POLAR,
		WidgetType.MONTHLY_PEAK_POLAR,
	],
	point: [WidgetType.CATEGORY_BUBBLE, WidgetType.TRANSACTION_SCATTER, WidgetType.YEARLY_SLOPE],
	other: [
		WidgetType.SPENDING_HEATMAP,
		WidgetType.CATEGORY_TREEMAP,
		WidgetType.CATEGORY_BOXPLOT,
		WidgetType.MONTHLY_BOXPLOT,
		WidgetType.SAVINGS_RATE_GAUGE,
		WidgetType.CATEGORY_SANKEY,
	],
};

export const WIDGET_CATALOG: WidgetCatalogData[] = GROUP_ORDER.map(group => ({
	group,
	label: GROUP_LABELS[group],
	widgets: GROUP_WIDGET_TYPES[group].filter(type => type in WIDGET_METADATA).map(type => WIDGET_METADATA[type]!),
}));

export const WIDGET_CATEGORY_TYPES: Partial<Record<WidgetType, CategoryType[]>> = {
	[WidgetType.INCOME_TREND]: [CategoryType.INCOME],
	[WidgetType.EXPENSE_TREND]: [CategoryType.EXPENSE],
	[WidgetType.BALANCE_TREND]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.INCOME_CATEGORY_TREND]: [CategoryType.INCOME],
	[WidgetType.EXPENSE_CATEGORY_TREND]: [CategoryType.EXPENSE],
	[WidgetType.BALANCE_YEAR_COMPARISON]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.INCOME_EXPENSE_COLUMN]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.EXPENSE_CATEGORY_COLUMN]: [CategoryType.EXPENSE],
	[WidgetType.MONTHLY_BALANCE_COLUMN]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.EXPENSE_SAVINGS_COMBO]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.TRANSACTION_COUNT_EXPENSE_COMBO]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.WEALTH_GROWTH_COMBO]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.EXPENSE_PIE]: [CategoryType.EXPENSE],
	[WidgetType.INCOME_PIE]: [CategoryType.INCOME],
	[WidgetType.SPENDING_RADAR]: [CategoryType.EXPENSE],
	[WidgetType.MONTHLY_CATEGORY_RADAR]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.CATEGORY_AVG_POLAR]: [CategoryType.EXPENSE],
	[WidgetType.MONTHLY_PEAK_POLAR]: [CategoryType.EXPENSE],
	[WidgetType.CATEGORY_BUBBLE]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.TRANSACTION_SCATTER]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.SPENDING_HEATMAP]: [CategoryType.EXPENSE],
	[WidgetType.CATEGORY_TREEMAP]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.CATEGORY_BOXPLOT]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.MONTHLY_BOXPLOT]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.YEARLY_SLOPE]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.CATEGORY_SANKEY]: [CategoryType.INCOME, CategoryType.EXPENSE],
	[WidgetType.EXPENSE_FREQUENCY_STATCARD]: [CategoryType.EXPENSE],
	[WidgetType.INCOME_FREQUENCY_STATCARD]: [CategoryType.INCOME],
	[WidgetType.NO_SPEND_DAYS_STATCARD]: [CategoryType.EXPENSE],
	[WidgetType.TOP_EXPENSE_CATEGORY_STATCARD]: [CategoryType.EXPENSE],
	[WidgetType.TOP_INCOME_CATEGORY_STATCARD]: [CategoryType.INCOME],
	[WidgetType.TOP_EXPENSE_TRANSACTION_STATCARD]: [CategoryType.EXPENSE],
	[WidgetType.TOP_INCOME_TRANSACTION_STATCARD]: [CategoryType.INCOME],
	[WidgetType.BURN_RATE_STATCARD]: [CategoryType.EXPENSE],
	[WidgetType.SAVINGS_RATE_STATCARD]: [CategoryType.INCOME],
};

export const CATEGORY_FILTERABLE_WIDGET_TYPES: WidgetType[] = Object.keys(WIDGET_CATEGORY_TYPES) as WidgetType[];

export const TIMEFRAME_HIDDEN_WIDGET_TYPES: WidgetType[] = [WidgetType.SPENDING_HEATMAP];

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
