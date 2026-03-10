import { ExChartType } from './ChartType';

// name of each individual chart (can be multiple of a chart type - 3 bar charts with different data)
export enum WidgetType {
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
