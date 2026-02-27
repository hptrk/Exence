import { ChartType } from 'ng-apexcharts';

export type ExChartType =
	| Exclude<ChartType, 'scatter' | 'candlestick' | 'polarArea' | 'rangeBar' | 'rangeArea'>
	| 'sankey'
	| 'statCard';
