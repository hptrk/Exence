import { ChartWidget } from '../../../app/data-model/modules/statistics/ChartWidget';
import { Timeframe } from '../../../app/data-model/modules/statistics/Timeframe';
import { WidgetType } from '../../../app/data-model/modules/statistics/widget-config.model';

export const MOCK_BAR_WIDGET: ChartWidget = {
	id: 1,
	type: WidgetType.INCOME_EXPENSE_COLUMN, // maps to 'bar' (isApexChart = true)
	title: 'Income vs Expense',
	timeframe: Timeframe.YEAR_TO_DATE,
	x: 0,
	y: 0,
	cols: 2,
	rows: 2,
};

export const MOCK_SANKEY_WIDGET: ChartWidget = {
	id: 2,
	type: WidgetType.CATEGORY_SANKEY, // maps to 'sankey' (isApexChart = false)
	title: 'Category Flow',
	timeframe: Timeframe.YEAR_TO_DATE,
	x: 0,
	y: 0,
	cols: 2,
	rows: 2,
};

export const MOCK_STATCARD_WIDGET: ChartWidget = {
	id: 3,
	type: WidgetType.BURN_RATE_STATCARD, // maps to 'statCard' (isApexChart = false)
	title: 'Burn Rate',
	timeframe: Timeframe.YEAR_TO_DATE,
	x: 0,
	y: 0,
	cols: 1,
	rows: 1,
};

export const MOCK_HEATMAP_WIDGET: ChartWidget = {
	id: 4,
	type: WidgetType.SPENDING_HEATMAP, // in TIMEFRAME_HIDDEN_WIDGET_TYPES
	title: 'Heatmap',
	timeframe: Timeframe.YEAR_TO_DATE,
	x: 0,
	y: 0,
	cols: 2,
	rows: 2,
};

export const MOCK_PAYLOAD = { series: [] } as unknown;
