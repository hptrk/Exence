import { Timeframe } from './Timeframe';
import { StatisticsWidgetType } from './widget-config.model';

export interface WidgetCreate {
	type: StatisticsWidgetType;
	title: string;
	timeframe: Timeframe;
	displayOrder?: number;
	x?: number;
	y?: number;
	cols?: number;
	rows?: number;
	settings?: Record<string, unknown>;
}
