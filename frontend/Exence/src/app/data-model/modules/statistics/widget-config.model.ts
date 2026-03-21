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
	}
}

// Widget catalog data structures
export interface WidgetCatalogItem {
	type: WidgetType;
	info: string;
	title: string;
	imgUrl: string;
}

export interface WidgetCatalogData {
	label: string;
	group: WidgetCatalogGroup;
	widgets: WidgetCatalogItem[];
}

export type WidgetCatalogGroup = 'all' | 'line_area' | 'bar' | 'mixed' | 'circular' | 'point' | 'card' | 'other';

const GROUP_LABELS: Record<WidgetCatalogGroup, string> = {
	all: 'All',
	card: 'Cards',
	line_area: 'Line & Area',
	bar: 'Bar',
	mixed: 'Mixed ',
	circular: 'Circular',
	point: 'Point',
	other: 'Other',
};
const GROUP_ORDER: WidgetCatalogGroup[] = ['all', 'line_area', 'bar', 'mixed', 'circular', 'point', 'card', 'other'];

const WIDGET_METADATA: Record<WidgetType, WidgetCatalogItem> = {
	// Stat Cards
	[WidgetType.EXPENSE_FREQUENCY_STATCARD]: {
		type: WidgetType.EXPENSE_FREQUENCY_STATCARD,
		title: 'Expense Frequency',
		info: 'Shows how often expenses occur within the selected period.',
		imgUrl: 'expense_frequency_statcard',
	},
	[WidgetType.INCOME_FREQUENCY_STATCARD]: {
		type: WidgetType.INCOME_FREQUENCY_STATCARD,
		title: 'Income Frequency',
		info: 'Shows how often income is received within the selected period.',
		imgUrl: 'income_frequency_statcard',
	},
	[WidgetType.NO_SPEND_DAYS_STATCARD]: {
		type: WidgetType.NO_SPEND_DAYS_STATCARD,
		title: 'No-Spend Days',
		info: 'Counts the number of days in the period with zero expense transactions.',
		imgUrl: 'no_spend_days_statcard',
	},
	[WidgetType.TOP_EXPENSE_CATEGORY_STATCARD]: {
		type: WidgetType.TOP_EXPENSE_CATEGORY_STATCARD,
		title: 'Top Expense Category',
		info: 'Highlights the category where the most money was spent.',
		imgUrl: 'top_expense_category_statcard',
	},
	[WidgetType.TOP_INCOME_CATEGORY_STATCARD]: {
		type: WidgetType.TOP_INCOME_CATEGORY_STATCARD,
		title: 'Top Income Category',
		info: 'Highlights the category that contributed the most income.',
		imgUrl: 'top_income_category_statcard',
	},
	[WidgetType.TOP_EXPENSE_TRANSACTION_STATCARD]: {
		type: WidgetType.TOP_EXPENSE_TRANSACTION_STATCARD,
		title: 'Top Expense Transaction',
		info: 'Displays the single largest expense transaction in the selected period.',
		imgUrl: 'top_expense_transaction_statcard',
	},
	[WidgetType.TOP_INCOME_TRANSACTION_STATCARD]: {
		type: WidgetType.TOP_INCOME_TRANSACTION_STATCARD,
		title: 'Top Income Transaction',
		info: 'Displays the single largest income transaction in the selected period.',
		imgUrl: 'top_income_transaction_statcard',
	},
	[WidgetType.BURN_RATE_STATCARD]: {
		type: WidgetType.BURN_RATE_STATCARD,
		title: 'Burn Rate',
		info: 'Shows the average daily spend rate to indicate how fast funds are being consumed.',
		imgUrl: 'burn_rate_statcard',
	},
	[WidgetType.SAVINGS_RATE_STATCARD]: {
		type: WidgetType.SAVINGS_RATE_STATCARD,
		title: 'Savings Rate',
		info: 'Displays the percentage of income that was saved after expenses.',
		imgUrl: 'savings_rate_statcard',
	},

	// Area/Line trends
	[WidgetType.INCOME_TREND]: {
		type: WidgetType.INCOME_TREND,
		title: 'Income Trend',
		info: 'Visualises income over time as a line or area chart to reveal growth or decline patterns.',
		imgUrl: 'income_trend',
	},
	[WidgetType.EXPENSE_TREND]: {
		type: WidgetType.EXPENSE_TREND,
		title: 'Expense Trend',
		info: 'Visualises expenses over time to highlight spending patterns and anomalies.',
		imgUrl: 'expense_trend',
	},
	[WidgetType.BALANCE_TREND]: {
		type: WidgetType.BALANCE_TREND,
		title: 'Balance Trend',
		info: 'Tracks net balance over time, showing whether finances are improving or deteriorating.',
		imgUrl: 'balance_trend',
	},
	[WidgetType.INCOME_CATEGORY_TREND]: {
		type: WidgetType.INCOME_CATEGORY_TREND,
		title: 'Income by Category Trend',
		info: 'Breaks down income trends per category over time using stacked or multi-line areas.',
		imgUrl: 'income_category_trend',
	},
	[WidgetType.EXPENSE_CATEGORY_TREND]: {
		type: WidgetType.EXPENSE_CATEGORY_TREND,
		title: 'Expense by Category Trend',
		info: 'Breaks down expense trends per category over time using stacked or multi-line areas.',
		imgUrl: 'expense_category_trend',
	},
	[WidgetType.BALANCE_YEAR_COMPARISON]: {
		type: WidgetType.BALANCE_YEAR_COMPARISON,
		title: 'Balance Year Comparison',
		info: 'Overlays balance curves from multiple years on a single chart for direct comparison.',
		imgUrl: 'balance_year_comparison',
	},

	// Column/Bar
	[WidgetType.INCOME_EXPENSE_COLUMN]: {
		type: WidgetType.INCOME_EXPENSE_COLUMN,
		title: 'Income vs Expense',
		info: 'Side-by-side columns comparing total income and expenses for each period.',
		imgUrl: 'income_expense_column',
	},
	[WidgetType.EXPENSE_CATEGORY_COLUMN]: {
		type: WidgetType.EXPENSE_CATEGORY_COLUMN,
		title: 'Expense by Category',
		info: 'Grouped or stacked columns showing expense breakdown across categories per period.',
		imgUrl: 'expense_category_column',
	},
	[WidgetType.MONTHLY_BALANCE_COLUMN]: {
		type: WidgetType.MONTHLY_BALANCE_COLUMN,
		title: 'Monthly Balance',
		info: 'A column chart of net balance per month to quickly spot positive and negative months.',
		imgUrl: 'monthly_balance_column',
	},

	// Mixed
	[WidgetType.EXPENSE_SAVINGS_COMBO]: {
		type: WidgetType.EXPENSE_SAVINGS_COMBO,
		title: 'Expense & Savings Combo',
		info: 'Combines a bar series for expenses with a line overlay for cumulative savings.',
		imgUrl: 'expense_savings_combo',
	},
	[WidgetType.TRANSACTION_COUNT_EXPENSE_COMBO]: {
		type: WidgetType.TRANSACTION_COUNT_EXPENSE_COMBO,
		title: 'Transaction Count & Expense Combo',
		info: 'Overlays transaction volume as a line on top of expense bars to reveal spending intensity.',
		imgUrl: 'transaction_count_expense_combo',
	},
	[WidgetType.WEALTH_GROWTH_COMBO]: {
		type: WidgetType.WEALTH_GROWTH_COMBO,
		title: 'Wealth Growth Combo',
		info: 'Combines income and expense bars with a cumulative wealth line to track net growth.',
		imgUrl: 'wealth_growth_combo',
	},

	// Pie/Donut
	[WidgetType.EXPENSE_PIE]: {
		type: WidgetType.EXPENSE_PIE,
		title: 'Expense Distribution',
		info: 'A pie or donut chart showing the proportional share of each expense category.',
		imgUrl: 'expense_pie',
	},
	[WidgetType.INCOME_PIE]: {
		type: WidgetType.INCOME_PIE,
		title: 'Income Distribution',
		info: 'A pie or donut chart showing the proportional share of each income category.',
		imgUrl: 'income_pie',
	},

	// Radar
	[WidgetType.SPENDING_RADAR]: {
		type: WidgetType.SPENDING_RADAR,
		title: 'Spending Radar',
		info: 'A radar chart mapping spending levels across categories for a holistic balance view.',
		imgUrl: 'spending_radar',
	},
	[WidgetType.MONTHLY_CATEGORY_RADAR]: {
		type: WidgetType.MONTHLY_CATEGORY_RADAR,
		title: 'Monthly Category Radar',
		info: 'Compares category spending patterns across multiple months on a single radar chart.',
		imgUrl: 'monthly_category_radar',
	},

	// Polar Area
	[WidgetType.CATEGORY_AVG_POLAR]: {
		type: WidgetType.CATEGORY_AVG_POLAR,
		title: 'Category Average Polar',
		info: 'A polar area chart displaying average spend per category, where segment size encodes magnitude.',
		imgUrl: 'category_avg_polar',
	},
	[WidgetType.MONTHLY_PEAK_POLAR]: {
		type: WidgetType.MONTHLY_PEAK_POLAR,
		title: 'Monthly Peak Polar',
		info: 'A polar area chart highlighting peak spending months with proportional segment sizing.',
		imgUrl: 'monthly_peak_polar',
	},

	// Bubble
	[WidgetType.CATEGORY_BUBBLE]: {
		type: WidgetType.CATEGORY_BUBBLE,
		title: 'Category Bubble',
		info: 'Plots categories as bubbles where position indicates timing and size encodes total amount.',
		imgUrl: 'category_bubble',
	},

	// Scatter
	[WidgetType.TRANSACTION_SCATTER]: {
		type: WidgetType.TRANSACTION_SCATTER,
		title: 'Transaction Scatter',
		info: 'Scatters individual transactions by date and amount to expose outliers and clusters.',
		imgUrl: 'transaction_scatter',
	},

	// Heatmap
	[WidgetType.SPENDING_HEATMAP]: {
		type: WidgetType.SPENDING_HEATMAP,
		title: 'Spending Heatmap',
		info: 'A calendar heatmap showing daily spending intensity across the year at a glance.',
		imgUrl: 'spending_heatmap',
	},

	// Treemap
	[WidgetType.CATEGORY_TREEMAP]: {
		type: WidgetType.CATEGORY_TREEMAP,
		title: 'Category Treemap',
		info: 'Nested rectangles sized by spend amount to show category and sub-category proportions.',
		imgUrl: 'category_treemap',
	},

	// Boxplot
	[WidgetType.CATEGORY_BOXPLOT]: {
		type: WidgetType.CATEGORY_BOXPLOT,
		title: 'Category Boxplot',
		info: 'Displays the statistical distribution of transactions per category including median and outliers.',
		imgUrl: 'category_boxplot',
	},
	[WidgetType.MONTHLY_BOXPLOT]: {
		type: WidgetType.MONTHLY_BOXPLOT,
		title: 'Monthly Boxplot',
		info: 'Displays the statistical distribution of daily spending per month to reveal variability.',
		imgUrl: 'monthly_boxplot',
	},

	// Gauge
	[WidgetType.SAVINGS_RATE_GAUGE]: {
		type: WidgetType.SAVINGS_RATE_GAUGE,
		title: 'Savings Rate Gauge',
		info: 'A radial gauge showing the current savings rate against a configurable target threshold.',
		imgUrl: 'savings_rate_gauge',
	},

	// Slope
	[WidgetType.YEARLY_SLOPE]: {
		type: WidgetType.YEARLY_SLOPE,
		title: 'Yearly Slope',
		info: 'A slope chart connecting year-start to year-end values to make directional change immediately obvious.',
		imgUrl: 'yearly_slope',
	},

	// Sankey
	[WidgetType.CATEGORY_SANKEY]: {
		type: WidgetType.CATEGORY_SANKEY,
		title: 'Category Sankey',
		info: 'A flow diagram showing how income is distributed and consumed across expense categories.',
		imgUrl: 'category_sankey',
	},
};

export const GROUP_WIDGET_TYPES: Record<WidgetCatalogGroup, WidgetType[]> = {
	all: Object.values(WidgetType),
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
	widgets: GROUP_WIDGET_TYPES[group].map(groupType => WIDGET_METADATA[groupType]),
}));
