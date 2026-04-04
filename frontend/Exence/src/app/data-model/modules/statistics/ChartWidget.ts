import { Timeframe } from './Timeframe';
import { WidgetType } from './widget-config.model';
import { WidgetSetting } from './WidgetSetting';

export interface ChartWidget {
	id: number;
	type: WidgetType;
	title: string;
	timeframe: Timeframe;
	x: number;
	y: number;
	cols: number;
	rows: number;
	settings?: Record<WidgetSetting, unknown>;
}
