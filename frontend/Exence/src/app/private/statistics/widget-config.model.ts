import { ExChartType } from './ChartType';
import { WidgetDataPayload } from './WidgetDataPayload';

export interface WidgetDataResponse<T extends WidgetDataPayload = WidgetDataPayload> {
	widgetId: number;
	type: WidgetType;
	data: T;
}

// name each individual chart (can be multiple of a chart type - 3 bar charts with different data)
export enum WidgetType {
	SAVINGS_GAUGAE,
	EXPENSE_TREND_AREA,
	CATEGORY_SANKEY,
	SPENDING_HEATMAP,
	EXAMPLE_STATCARD,
}

export interface Widget {
	id: number;
	type: WidgetType;
	title: string;
}

export function mapToExChartType(widgetType: WidgetType): ExChartType {
	switch (widgetType) {
		case WidgetType.SAVINGS_GAUGAE:
			return 'radialBar';
		case WidgetType.EXPENSE_TREND_AREA:
			return 'area';
		case WidgetType.CATEGORY_SANKEY:
			return 'sankey';
		case WidgetType.SPENDING_HEATMAP:
			return 'heatmap';
		case WidgetType.EXAMPLE_STATCARD:
			return 'statCard';
	}
}
