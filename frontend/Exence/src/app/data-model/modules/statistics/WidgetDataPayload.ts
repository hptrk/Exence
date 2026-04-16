import { MaterialIcon } from '../category/MaterialIcon';
import { WidgetType } from './WidgetType';

export type WidgetDataPayload =
	| SeriesPayload
	| DistributionPayload
	| BoxplotPayload
	| BubblePayload
	| SankeyPayload
	| SlopePayload
	| GaugePayload
	| StatCardPayload
	| LeaderboardPayload
	| SummaryPayload;

export interface SeriesPayload {
	type: WidgetType;
	series: SeriesItem[];
}

export interface SeriesItem {
	name: string;
	type?: string;
	color?: string;
	data: DataPoint[];
}

export interface DataPoint {
	x: string;
	y: number;
	fillColor?: string;
}

export interface DistributionPayload {
	type: WidgetType;
	data: DistributionItem[];
}

export interface DistributionItem {
	name: string;
	amount: number;
	color?: string;
}

export interface BoxplotPayload {
	type: WidgetType;
	data: BoxplotPoint[];
}

export interface BoxplotPoint {
	x: string;
	y: number[];
	color?: string;
}

export interface BubblePayload {
	type: WidgetType;
	series: BubbleSeries[];
}

export interface BubbleSeries {
	name: string;
	color: string;
	data: BubblePoint[];
}

export interface BubblePoint {
	x: number; // count
	y: number; // avg
	z: number; // sum
}

export interface SankeyPayload {
	type: WidgetType;
	data: SankeyLink[];
}

export interface SankeyLink {
	from: string;
	to: string;
	value: number;
	color: string;
}

export interface SlopePayload {
	type: WidgetType;
	data: SlopeItem[];
}

export interface SlopeItem {
	category: string;
	yearsData: Map<string, number>; // 2026 - 1000Ft
	color: string;
}

export interface GaugePayload {
	type: WidgetType;
	data: number;
}

export interface StatCardPayload {
	type: WidgetType;
	value: number;
	changePercentage?: number;
	trend?: 'UP' | 'DOWN' | 'NEUTRAL';
	contextLabel?: string;
	icon?: MaterialIcon | string;
	iconColor?: string;
	unit: string;
}

export interface LeaderboardPayload {
	type: WidgetType;
	entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
	rank: number;
	username: string;
	value: number;
}

export interface SummaryPayload {
	type: WidgetType;
	items: SummaryItem[];
}

export interface SummaryItem {
	label: string;
	value: number;
	icon: string;
}
