import { MaterialIcon } from '../category/MaterialIcon';

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
	data: DistributionItem[];
}

export interface DistributionItem {
	name: string;
	amount: number;
	color?: string;
}

export interface BoxplotPayload {
	data: BoxplotPoint[];
}

export interface BoxplotPoint {
	x: string;
	y: number[];
	color?: string;
}

export interface BubblePayload {
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
	data: SankeyLink[];
}

export interface SankeyLink {
	from: string;
	to: string;
	value: number;
	color: string;
}

export interface SlopePayload {
	data: SlopeItem[];
}

export interface SlopeItem {
	category: string;
	yearsData: Map<string, number>; // 2026 - 1000Ft
	color: string;
}

export interface GaugePayload {
	data: number;
}

export interface StatCardPayload {
	value: number;
	changePercentage?: number;
	trend?: 'UP' | 'DOWN' | 'NEUTRAL';
	contextLabel?: string;
	icon?: MaterialIcon | string;
	iconColor?: string;
	unit: string;
}

export interface LeaderboardPayload {
	entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
	rank: number;
	username: string;
	value: number;
}

export interface SummaryPayload {
	items: SummaryItem[];
}

export interface SummaryItem {
	label: string;
	value: number;
	icon: string;
}
