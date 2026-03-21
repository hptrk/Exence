import { Timeframe } from './Timeframe';
import { WidgetType } from './widget-config.model';

export interface Widget {
	id: number;
	type: WidgetType;
	title: string;
	timeframe: Timeframe;
	displayOrder?: number;
	x: number;
	y: number;
	settings?: Record<string, unknown>;
}

export interface StatCardWidget {
	id: number;
	type: WidgetType;
	title: string;
	timeframe: Timeframe;
	displayOrder: number;
}

export interface ChartWidget {
	id: number;
	type: WidgetType;
	title: string;
	x: number;
	y: number;
	settings?: Record<string, unknown>;
}
