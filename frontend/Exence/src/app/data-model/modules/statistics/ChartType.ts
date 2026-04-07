import { ChartType } from 'ng-apexcharts';

export type ExChartType =
	| Exclude<ChartType, 'candlestick' | 'rangeBar' | 'rangeArea'>
	| 'sankey'
	| 'statCard'
	| 'leaderboard';
