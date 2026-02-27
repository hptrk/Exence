import { ApexOptions } from 'ng-apexcharts';
import { ExChartType } from './ChartType';
import { SankeyPayload, SeriesPayload, StatCardPayload, WidgetDataPayload } from './WidgetDataPayload';

export type ProviderFn<T extends WidgetDataPayload = WidgetDataPayload> = (data: T) => Partial<ApexOptions> | T;

// TODO if there are some configs that all kinds of charts share and are the same for each
const baseChartOptions: Partial<ApexOptions> = {};

// Providers
const SankeyProvider: ProviderFn<SankeyPayload> = (_data: SankeyPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const StatCardProvider: ProviderFn<StatCardPayload> = (data: StatCardPayload): StatCardPayload => {
	return { ...data };
};

const LineProvider: ProviderFn<SeriesPayload> = (_data: SeriesPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const AreaProvider: ProviderFn<SeriesPayload> = (_data: SeriesPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const BarProvider: ProviderFn<SeriesPayload> = (_data: SeriesPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const PieProvider: ProviderFn<SeriesPayload> = (_data: SeriesPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const DonutProvider: ProviderFn<SeriesPayload> = (_data: SeriesPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const RadialBarProvider: ProviderFn<SeriesPayload> = (_data: SeriesPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const BubbleProvider: ProviderFn<SeriesPayload> = (_data: SeriesPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const HeatmapProvider: ProviderFn<SeriesPayload> = (_data: SeriesPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const BoxPlotProvider: ProviderFn<SeriesPayload> = (_data: SeriesPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const RadatProvider: ProviderFn<SankeyPayload> = (_data: SankeyPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

const TreemapProvider: ProviderFn<SankeyPayload> = (_data: SankeyPayload): ApexOptions => {
	return {
		...baseChartOptions,
		chart: { type: 'donut' },
		plotOptions: {
			pie: { donut: { size: '70%', background: 'transparent' } },
		},
		colors: ['var(--primary-color)'],
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CHART_PROVIDER_REGISTRY: Record<ExChartType, ProviderFn<any>> = {
	sankey: SankeyProvider,
	statCard: StatCardProvider,
	line: LineProvider,
	area: AreaProvider,
	bar: BarProvider,
	pie: PieProvider,
	donut: DonutProvider,
	radialBar: RadialBarProvider,
	bubble: BubbleProvider,
	heatmap: HeatmapProvider,
	boxPlot: BoxPlotProvider,
	radar: RadatProvider,
	treemap: TreemapProvider,
};

export function mapToProvider<T extends WidgetDataPayload>(type: ExChartType): ProviderFn<T> {
	return CHART_PROVIDER_REGISTRY[type]! as ProviderFn<T>;
}
