import { WidgetSetting } from './WidgetSetting';

export interface ChartLayoutItemRequest {
	id: number;
	x: number;
	y: number;
	cols: number;
	rows: number;
	settings?: Record<WidgetSetting, unknown>;
	title?: string;
}
