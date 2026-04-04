import { Timeframe } from './Timeframe';
import { WidgetType } from './widget-config.model';
import { WidgetSetting } from './WidgetSetting';

export interface StatCardWidget {
	id: number;
	type: WidgetType;
	title: string;
	timeframe: Timeframe;
	displayOrder: number;
	settings?: Record<WidgetSetting, unknown>;
}
