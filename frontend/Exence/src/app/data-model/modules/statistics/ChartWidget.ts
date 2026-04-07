import { Timeframe } from './Timeframe';
import { AdminWidgetType, WidgetType } from './widget-config.model';
import { WidgetSetting } from './WidgetSetting';

export interface ChartWidget {
	id: number;
	type: WidgetType | AdminWidgetType;
	title: string;
	timeframe: Timeframe;
	x: number;
	y: number;
	cols: number;
	rows: number;
	settings?: Record<WidgetSetting, unknown>;
}
