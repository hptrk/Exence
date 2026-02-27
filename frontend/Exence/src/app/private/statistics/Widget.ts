import { Timeframe } from './Timeframe';
import { WidgetType } from './widget-config.model';

export interface Widget {
	id: number;
	type: WidgetType;
	displayOrder: number;
	x: number;
	y: number;
	cols: number;
	rows: number;
	settings: Record<string, unknown>;
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
	x: number;
	y: number;
	settings: Record<string, unknown>;
}
