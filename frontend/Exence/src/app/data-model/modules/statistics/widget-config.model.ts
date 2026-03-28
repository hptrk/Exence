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

/* eslint-disable-next-line complexity */
export function mapToExChartType(widgetType: WidgetType): ExChartType {
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
