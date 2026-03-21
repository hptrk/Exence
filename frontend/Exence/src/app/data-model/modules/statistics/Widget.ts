import { Timeframe } from './Timeframe';
import { WidgetType } from './widget-config.model';

export interface Widget {
	id?: number;
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

export interface StatCardWidget {
	id: number;
	type: WidgetType;
	title: string;
	info: string;
	timeframe: Timeframe;
	displayOrder: number;
	settings?: Record<string, unknown>;
}

export interface ChartWidget {
	id: number;
	type: WidgetType;
	title: string;
	info: string;
	timeframe: Timeframe;
	x: number;
	y: number;
	cols: number;
	rows: number;
	settings?: Record<string, unknown>;
}
