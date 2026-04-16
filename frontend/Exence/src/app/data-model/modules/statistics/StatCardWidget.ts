import { Timeframe } from './Timeframe';
import { StatisticsWidgetType } from './widget-config.model';
import { WidgetSetting } from './WidgetSetting';

export interface StatCardWidget {
	id: number;
	type: StatisticsWidgetType;
	title: string;
	timeframe: Timeframe;
	displayOrder: number;
	settings?: Record<WidgetSetting, unknown>;
}
