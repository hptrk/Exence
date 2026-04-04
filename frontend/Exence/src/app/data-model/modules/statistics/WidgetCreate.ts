import { Timeframe } from './Timeframe';
import { WidgetType } from './widget-config.model';

export interface WidgetCreate {
	type: WidgetType;
	title: string;
	timeframe: Timeframe;
	displayOrder?: number;
	x?: number;
	y?: number;
	cols?: number;
	rows?: number;
	settings?: Record<string, unknown>;
}
