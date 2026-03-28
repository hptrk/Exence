import {
	ApexAxisChartSeries,
	ApexChart,
	ApexLocale,
	ApexNonAxisChartSeries,
	ApexOptions,
	ApexYAxis,
} from 'ng-apexcharts';
import {
	buildLinks,
	buildNodeMap,
	findHubNode,
	formatNumber,
	getCssVariableValue,
	lightenHexColor,
} from '../../shared/util/utils';
import { ExChartType } from '../../data-model/modules/statistics/ChartType';
import {
	BoxplotPayload,
	BubblePayload,
	DistributionPayload,
	GaugePayload,
	SankeyPayload,
	SeriesPayload,
	SlopePayload,
	StatCardPayload,
	WidgetDataPayload,
} from '../../data-model/modules/statistics/WidgetDataPayload';
import { EChartsOption } from 'echarts/types/dist/shared';

export type ProviderFn<T extends WidgetDataPayload = WidgetDataPayload> = (
	data: T,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
) => Partial<ApexOptions> | T | EChartsOption;

function truncateTitle(title: string, max = 25): string {
	return title.length > max ? title.slice(0, max).trimEnd() + '…' : title;
}

export function buildApexLocale(lang: string, translate: (key: string) => string): ApexLocale {
	return {
		name: lang,
		options: {
			toolbar: {
				exportToSVG: translate('statistics.charts.toolbar.exportToSVG'),
				exportToPNG: translate('statistics.charts.toolbar.exportToPNG'),
				exportToCSV: translate('statistics.charts.toolbar.exportToCSV'),
				menu: translate('statistics.charts.toolbar.menu'),
				selection: translate('statistics.charts.toolbar.selection'),
				selectionZoom: translate('statistics.charts.toolbar.selectionZoom'),
				zoomIn: translate('statistics.charts.toolbar.zoomIn'),
				zoomOut: translate('statistics.charts.toolbar.zoomOut'),
				pan: translate('statistics.charts.toolbar.pan'),
				reset: translate('statistics.charts.toolbar.reset'),
			},
		},
	};
}

// common config for most charts from apexcharts
const commonChartOptions: Partial<ApexOptions> = {
	chart: {
		foreColor: 'currentColor',
		toolbar: {
			show: true,
		},
		height: '100%',
	} as ApexChart,
	legend: {
		show: true,
		position: 'top',
		horizontalAlign: 'left',
		fontSize: '14px',
	},
	xaxis: {
		position: 'bottom',
		labels: {
			style: {
				fontSize: '18px',
				fontWeight: 'bold',
			},
			offsetY: 10,
		},
	},
	yaxis: {
		labels: {
			style: {
				fontSize: '14px',
			},
		},
	},
	title: {
		style: {
			fontSize: '18px',
			fontFamily: 'Montserrat, Arial, sans-serif',
			fontWeight: 700,
		},
		offsetX: 25,
	},
};

function getCommonChart(translate?: (key: string) => string): ApexChart {
	const base = commonChartOptions.chart as ApexChart;
	if (!translate) return base;
	return {
		...base,
		locales: [buildApexLocale('app', translate)],
		defaultLocale: 'app',
	};
}

// Providers
const SankeyProvider: ProviderFn<SankeyPayload> = (
	{ data }: SankeyPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): EChartsOption => {
	const sourceNames = new Set(data.map(link => link.from));
	const targetNames = new Set(data.map(link => link.to));

	const hub = findHubNode(data, sourceNames, targetNames);
	const mixedCategories = new Set([...sourceNames].filter(name => targetNames.has(name) && name !== hub));

	const nodeMap = buildNodeMap(data, mixedCategories);
	const links = buildLinks(data, mixedCategories);

	const fallbackColor = getCssVariableValue('--primary-color');
	const textColor = getCssVariableValue('--default-text-color');

	return {
		series: [
			{
				type: 'sankey',
				nodeGap: 16,
				links,
				nodes: [...nodeMap.values()].map(node => ({
					id: node.id,
					name: node.name,
					itemStyle: {
						color: node.color && node.name !== hub ? node.color : fallbackColor,
					},
				})),
				lineStyle: {
					color: 'gradient',
					opacity: 0.35,
				},
				top: '10%',
				label: {
					show: true,
					color: textColor,
					fontSize: 14,
					fontWeight: 'bold',
				},
				draggable: false,
			},
		],
		title: {
			text: truncateTitle(title),
			textVerticalAlign: 'middle',
			textAlign: 'left',
			left: 30,
			textStyle: {
				color: textColor,
				fontSize: '18px',
			},
		},
		tooltip: {
			trigger: 'item',
			triggerOn: 'mousemove',
			backgroundColor: getCssVariableValue('--app-background-color'),
			textStyle: {
				color: textColor,
			},
			borderRadius: 10,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			formatter: (params: any) => {
				if (params.dataType === 'node') {
					return params.data.name;
				}
				const sourceNode = nodeMap.get(params.data.source);
				const targetNode = nodeMap.get(params.data.target);
				if (sourceNode?.name === hub && sourceNode?.color) sourceNode.color = fallbackColor;
				if (targetNode?.name === hub && targetNode?.color) targetNode.color = fallbackColor;
				const colorSquare = (color: string): string =>
					`<span style="display:inline-block;width:12px;height:12px;border-radius:2px;background-color:${color};flex-shrink:0"></span>`;
				return `
                    <div class="d-flex flex-column gap-2 p-2">
                        <div class="d-flex flex-row flex-nowrap gap-2 align-items-center justify-content-between">
                            <div>${translate?.('statistics.charts.from')}: <span class="fw-semibold">${sourceNode?.name ?? params.data.source}</span></div>
                            ${sourceNode?.color ? colorSquare(sourceNode.color) : fallbackColor}
                        </div>
                        <div class="d-flex flex-row flex-nowrap gap-2 align-items-center justify-content-between">
                            <div>${translate?.('statistics.charts.to')}: <span class="fw-semibold">${targetNode?.name ?? params.data.target}</span></div>
                            ${targetNode?.color ? colorSquare(targetNode.color) : fallbackColor}
                        </div>
                        <div>${translate?.('statistics.charts.amount')}: <span class="fw-bold">${formatNumber(params.data.value)}</span></div>
                    </div>
                `;
			},
		},
	};
};

const StatCardProvider: ProviderFn<StatCardPayload> = (
	data: StatCardPayload,
	_title: string,
	_translate?: (key: string, params?: Record<string, unknown>) => string,
): StatCardPayload => {
	return { ...data };
};

const LineProvider: ProviderFn<SeriesPayload> = (
	data: SeriesPayload | SlopePayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const isSlopeChart = 'series' in data ? false : true;
	const isMixed = isSlopeChart ? false : (data as SeriesPayload).series.some(si => si.type !== 'line');

	const fallbackColors = [
		getCssVariableValue('--primary-color'),
		getCssVariableValue('--accent-text-color'),
		getCssVariableValue('--tertiary-color'),
		getCssVariableValue('--error-color'),
		getCssVariableValue('--warn-color'),
		getCssVariableValue('--secondary-color'),
	];

	function mapSlopeDataToSeriesData(slopeData: Map<string, number>): { x: string; y: number }[] {
		const result: { x: string; y: number }[] = [];
		Object.entries(slopeData).forEach(([x, y]) => {
			result.push({ x, y });
		});
		return result;
	}

	let series: ApexAxisChartSeries;
	if (isSlopeChart) {
		const payload = data as SlopePayload;
		series = payload.data.map(si => ({
			name: si.category,
			color: si.color,
			data: mapSlopeDataToSeriesData(si.yearsData),
		}));
	} else {
		const payload = data as SeriesPayload;
		series = payload.series.map((si, i) => ({
			...si,
			color: si.color ?? fallbackColors[i],
		}));
	}

	const yAxisConfig: ApexYAxis | ApexYAxis[] = isMixed
		? (data as SeriesPayload).series.map(si => ({
				...commonChartOptions.yaxis,
				title: {
					text: si.name,
					offsetX: si.type !== 'line' ? 10 : -10,
					style: {
						fontSize: '14px',
						fontWeight: 'semibold',
					},
				},
				opposite: si.type !== 'line',
				labels: {
					formatter(val) {
						return formatNumber(val);
					},
				},
			}))
		: {
				...commonChartOptions.yaxis,
				labels: {
					formatter(val) {
						return formatNumber(val);
					},
				},
			};

	return {
		...commonChartOptions,
		chart: { ...getCommonChart(translate), type: 'line' },
		series,
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		plotOptions: {
			line: {
				isSlopeChart,
			},
		},
		dataLabels: {
			enabled: isSlopeChart,
			background: {
				enabled: true,
				padding: 8,
			},
			style: {
				fontSize: '14px',
			},
			formatter(_, opts) {
				const seriesName = opts.w.config.series[opts.seriesIndex].name;
				return seriesName ?? '';
			},
			offsetY: -10,
		},
		tooltip: {
			followCursor: true,
			intersect: false,
			shared: true,
		},
		xaxis: {
			...commonChartOptions.xaxis,
			labels: {
				style: {
					fontSize: isSlopeChart ? '20px' : '18px',
				},
				offsetY: isSlopeChart ? 5 : isMixed ? 5 : 10,
			},
		},
		yaxis: yAxisConfig,
		stroke: {
			curve: 'smooth',
		},
		colors: fallbackColors,
	};
};

const AreaProvider: ProviderFn<SeriesPayload> = (
	{ series }: SeriesPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const isIncome = series.length === 1 && !!series.find(s => s.name.toLowerCase() === 'income');
	const isExpense = series.length === 1 && !!series.find(s => s.name.toLowerCase() === 'expense');

	const incomeColor = 'var(--tertiary-color)';
	const expenseColor = 'var(--error-color)';
	const fallbackColors = [
		getCssVariableValue('--primary-color'),
		getCssVariableValue('--accent-color'),
		getCssVariableValue('--tertiary-color'),
		getCssVariableValue('--error-color'),
		getCssVariableValue('--warn-color'),
		getCssVariableValue('--secondary-color'),
	];

	return {
		...commonChartOptions,
		chart: { ...getCommonChart(translate), type: 'area', stacked: true },
		series,
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		fill: {
			type: 'gradient',
			gradient: {
				opacityFrom: 0.8,
				opacityTo: 0.7,
				gradientToColors: series.map(
					(si, i) => si.color ?? (isIncome ? incomeColor : isExpense ? expenseColor : fallbackColors[i]),
				),
			},
		},
		dataLabels: {
			enabled: false,
		},
		tooltip: {
			intersect: false,
			shared: true,
			x: {
				format: 'yyyy MMMM dd.',
			},
		},
		stroke: {
			width: 7,
			curve: 'monotoneCubic',
		},
		colors: isIncome ? [incomeColor] : isExpense ? [expenseColor] : fallbackColors,
		xaxis: {
			...commonChartOptions.xaxis,
			type: 'datetime',
			labels: {
				show: true,
				rotate: 0,
				rotateAlways: false,
				hideOverlappingLabels: true,
				showDuplicates: false,
				format: 'yyyy MMM.',
			},
			tickPlacement: 'between',
		},
		yaxis: {
			...commonChartOptions.yaxis,
			labels: {
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
	};
};

const BarProvider: ProviderFn<SeriesPayload> = (
	{ series }: SeriesPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const fallbackColors = [
		'var(--primary-color)',
		'var(--accent-color)',
		'var(--tertiary-color)',
		'var(--error-color)',
		'var(--warn-color)',
		'var(--secondary-color)',
	];

	return {
		...commonChartOptions,
		chart: { ...getCommonChart(translate), type: 'bar' },
		series,
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		plotOptions: {
			bar: {
				horizontal: false,
				borderRadiusApplication: 'end',
				borderRadius: 4,
			},
		},
		dataLabels: {
			enabled: false,
		},
		xaxis: {
			...commonChartOptions.xaxis,
			type: 'datetime',
			labels: {
				show: true,
				rotate: 0,
				rotateAlways: false,
				hideOverlappingLabels: true,
				showDuplicates: false,
				format: 'yyyy MMM.',
				style: {
					fontSize: '16px',
				},
			},
			tickPlacement: 'between',
		},
		colors: fallbackColors,
		yaxis: {
			...commonChartOptions.yaxis,
			labels: {
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
	};
};

const PieProvider: ProviderFn<DistributionPayload> = (
	payload: DistributionPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const colors: string[] = [];
	const labels: string[] = [];
	const data: number[] = [];
	payload.data.map(di => {
		colors.push(di.color ?? 'var(--primary-color)');
		labels.push(di.name);
		data.push(di.amount);
	});

	return {
		...commonChartOptions,
		chart: {
			...getCommonChart(translate),
			type: 'pie',
		},
		series: data,
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		fill: {
			type: 'gradient',
			gradient: {
				gradientToColors: colors.map(color => lightenHexColor(color, 0.15)),
			},
		},
		colors,
		labels,
		stroke: {
			width: 0,
		},
		dataLabels: {
			style: {
				fontSize: '18px',
			},
		},
		responsive: [
			{
				breakpoint: 500,
				options: {
					dataLabels: {
						style: {
							fontSize: '14px',
						},
					},
				},
			},
		],
		yaxis: {
			...commonChartOptions.yaxis,
			labels: {
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
	};
};

const DonutProvider: ProviderFn<DistributionPayload> = (
	payload: DistributionPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const colors: string[] = [];
	const labels: string[] = [];
	const data: number[] = [];
	payload.data.map(di => {
		colors.push(di.color ?? 'var(--primary-color)');
		labels.push(di.name);
		data.push(di.amount);
	});

	return {
		...commonChartOptions,
		chart: {
			...getCommonChart(translate),
			type: 'donut',
		},
		series: data,
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		fill: {
			type: 'gradient',
			gradient: {
				gradientToColors: colors.map(color => lightenHexColor(color, 0.15)),
			},
		},
		colors,
		labels,
		stroke: {
			width: 0,
		},
		dataLabels: {
			style: {
				fontSize: '18px',
			},
		},
		responsive: [
			{
				breakpoint: 500,
				options: {
					dataLabels: {
						style: {
							fontSize: '14px',
						},
					},
				},
			},
		],
		yaxis: {
			...commonChartOptions.yaxis,
			labels: {
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
	};
};

const RadialBarProvider: ProviderFn<GaugePayload> = (
	{ data }: GaugePayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	return {
		...commonChartOptions,
		chart: {
			...getCommonChart(translate),
			type: 'radialBar',
		},
		series: [data],
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		labels: [truncateTitle(title)],
		plotOptions: {
			radialBar: {
				startAngle: -135,
				endAngle: 135,
				dataLabels: {
					name: {
						fontSize: '20px',
						fontWeight: 'bold',
						offsetY: 205,
						color: 'var(--primary-color)',
					},
					value: {
						offsetY: 150,
						fontSize: '36px',
						formatter: val => val + '%',
						color: 'var(--default-text-color)',
					},
				},
			},
		},
		stroke: {
			dashArray: 5,
		},
		legend: {
			show: false,
		},
	};
};

const BubbleProvider: ProviderFn<BubblePayload> = (
	{ series }: BubblePayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	return {
		...commonChartOptions,
		chart: { ...getCommonChart(translate), type: 'bubble' },
		series,
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		dataLabels: {
			enabled: false,
		},
		tooltip: {
			x: {
				formatter: function (val, _) {
					return `Number of transactions: ${formatNumber(+val)}`;
				},
			},
			y: {
				title: {
					formatter: function (val, _) {
						return `Average amount in '${val}': `;
					},
				},
			},
			z: {
				title: 'Sum of transaction amounts: ',
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
		xaxis: {
			...commonChartOptions.xaxis,
			labels: {
				...commonChartOptions.xaxis?.labels,
				style: {
					...commonChartOptions.xaxis?.labels?.style,
					fontSize: '14px',
				},
				offsetY: 5,
			},
		},
		yaxis: {
			labels: {
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
	};
};

const HeatmapProvider: ProviderFn<SeriesPayload> = (
	{ series }: SeriesPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const allItems = series
		.flatMap(si => si.data)
		.map(item => item.y)
		.filter(item => item > 0);
	const min = Math.min(...allItems);
	const max = Math.max(...allItems);
	const step = (max - min) / 5;
	const cellSize = 40;
	const rows = series.length;
	return {
		...commonChartOptions,
		chart: {
			...getCommonChart(translate),
			type: 'heatmap',
			height: rows * cellSize,
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
			selection: {
				enabled: false,
			},
		},
		series,
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		plotOptions: {
			heatmap: {
				radius: 5,
				distributed: false,
				enableShades: false,
				shadeIntensity: 0.65,
				colorScale: {
					ranges: [
						{
							from: 0,
							to: min,
							color: 'var(--apexchart-primary-shade-1)',
							name: 'None',
						},
						{
							from: min,
							to: min + step,
							color: 'var(--apexchart-primary-shade-2)',
							name: 'Small',
						},
						{
							from: min + step + 0.0001,
							to: min + step * 2,
							color: 'var(--apexchart-primary-shade-3)',
							name: 'Medium',
						},
						{
							from: min + step * 2 + 0.0001,
							to: min + step * 3,
							color: 'var(--apexchart-primary-shade-4)',
							name: 'High',
						},
						{
							from: min + step * 3 + 0.0001,
							to: max,
							color: 'var(--apexchart-primary-shade-5)',
							name: 'Extreme',
						},
					],
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		grid: {
			show: false,
		},
		xaxis: {
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
			labels: {
				formatter: function (val, _, opts) {
					const i = opts?.dataPointIndex ?? opts?.i ?? val;

					if (i === undefined || i === null || isNaN(i)) return val;

					const date = new Date(2023, i, 1);
					if (opts?.dateFormatter) return opts.dateFormatter(date, 'MMM');

					return date.toLocaleString('default', { month: 'short' });
				},
				style: {
					fontSize: '14px',
					fontWeight: 'bold',
				},
			},
		},
		yaxis: {
			labels: {
				show: false,
			},
		},
		tooltip: {
			y: {
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
	};
};

const BoxPlotProvider: ProviderFn<BoxplotPayload> = (
	payload: BoxplotPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const fallbackColors = [
		getCssVariableValue('--primary-color'),
		getCssVariableValue('--accent-text-color'),
		getCssVariableValue('--tertiary-color'),
		getCssVariableValue('--error-color'),
		getCssVariableValue('--warn-color'),
		getCssVariableValue('--secondary-color'),
	];

	return {
		...commonChartOptions,
		chart: {
			...getCommonChart(translate),
			type: 'boxPlot',
		},
		series: [
			{
				name: 'box',
				type: 'boxPlot',
				data: payload.data.map((d, i) => ({ ...d, fillColor: d.color ?? fallbackColors[i] })),
			},
		],
		xaxis: {
			...commonChartOptions.xaxis,
			labels: {
				...commonChartOptions.xaxis?.labels,
				offsetY: 5,
			},
		},
		yaxis: {
			...commonChartOptions.yaxis,
			labels: {
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		tooltip: {
			custom: function ({ series, seriesIndex, dataPointIndex, w }) {
				if (!series) return;
				const point = w.config.series[seriesIndex].data[dataPointIndex];
				const [min, q1, median, q3, max] = point.y;
				return `
					<div class="d-flex flex-column gap-2 p-2">
					<div class="d-flex flex-row gap-2 fw-medium">${translate?.('statistics.charts.max')} <span class="fw-bold">${formatNumber(max)}</span></div>
					<div class="d-flex flex-row gap-2 fw-medium">${translate?.('statistics.charts.q3')}<span class="fw-bold">${formatNumber(q3)}</span></div>
					<div class="d-flex flex-row gap-2 fw-medium">${translate?.('statistics.charts.median')}<span class="fw-bold">${formatNumber(median)}</span></div>
					<div class="d-flex flex-row gap-2 fw-medium">${translate?.('statistics.charts.q1')}<span class="fw-bold">${formatNumber(q1)}</span></div>
					<div class="d-flex flex-row gap-2 fw-medium">${translate?.('statistics.charts.min')}<span class="fw-bold">${formatNumber(min)}</span></div>
					</div>
					`;
			},
		},
	};
};

const RadarProvider: ProviderFn<SeriesPayload> = (
	payload: SeriesPayload | DistributionPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const instanceOfDistributionPayload = 'data' in payload;
	let series: ApexNonAxisChartSeries;
	const colors: string[] = [];
	const labels: string[] = [];
	if (instanceOfDistributionPayload) {
		const data: number[] = [];
		payload.data.map(di => {
			colors.push(di.color ?? 'var(--primary-color)');
			labels.push(di.name);
			data.push(di.amount);
		});
		series = [{ name: '', data }];
	} else {
		series = payload.series.map(si => ({
			...si,
			name: new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'short' }).format(new Date(si.name)), // TODO this should be the default after localization
		}));
	}

	return {
		...commonChartOptions,
		chart: {
			...getCommonChart(translate),
			type: 'radar',
			dropShadow: {
				enabled: true,
				blur: 2,
				left: 5,
				top: 5,
			},
		},
		series,
		colors,
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		xaxis: {
			...commonChartOptions.xaxis,
			categories: labels,
		},
		yaxis: {
			show: false,
		},
		plotOptions: {
			radar: {
				polygons: {
					fill: {
						colors: ['var(--apexchart-primary-shade-1)', 'var(--app-card-color)'],
					},
				},
			},
		},
		fill: {
			opacity: 0.5,
		},
		tooltip: {
			y: {
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
	};
};

const TreemapProvider: ProviderFn<SeriesPayload> = (
	{ series }: SeriesPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const positiveColor = getCssVariableValue('--tertiary-color');
	const negativeColor = getCssVariableValue('--error-color');

	// eslint-disable-next-line
	function getFormattedValue(value: number, opts: any): string {
		const seriesName: string = opts.w.config.series[opts.seriesIndex].name;
		const isExpense = seriesName.toLowerCase() === 'expense';
		const multiplier = isExpense ? -1 : 1;
		return String(value * multiplier);
	}

	return {
		...commonChartOptions,
		chart: {
			...getCommonChart(translate),
			type: 'treemap',
		},
		series,
		colors: [negativeColor, positiveColor],
		plotOptions: {
			treemap: {
				distributed: false,
				enableShades: true,
				shadeIntensity: 0.65,
				dataLabels: {
					format: 'truncate',
				},
			},
		},
		dataLabels: {
			enabled: true,
			formatter: (text, opts) => [String(text), formatNumber(+getFormattedValue(+opts.value, opts))],
			offsetY: -7,
		},
		tooltip: {
			y: {
				formatter: (value, opts) => formatNumber(+getFormattedValue(value, opts)),
			},
		},
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
	};
};

const ScatterProvider: ProviderFn<SeriesPayload> = (
	{ series }: SeriesPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const labels = new Set<string>();
	series.forEach(si => {
		si.data.forEach(d => labels.add(d.x));
	});

	return {
		...commonChartOptions,
		chart: { ...getCommonChart(translate), type: 'scatter' },
		series,
		xaxis: {
			...commonChartOptions.xaxis,
			type: 'datetime',
			labels: {
				...commonChartOptions.xaxis?.labels,
				show: true,
				rotate: 0,
				rotateAlways: false,
				hideOverlappingLabels: true,
				showDuplicates: false,
				format: 'yyyy MMM.',
				style: {
					fontSize: '14px',
					fontWeight: 'semibold',
				},
				offsetY: 5,
			},
			tickPlacement: 'between',
		},
		tooltip: {
			x: {
				format: 'yyyy MMMM dd.',
			},
		},
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
		yaxis: {
			...commonChartOptions.yaxis,
			labels: {
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
	};
};

const PolarAreaProvider: ProviderFn<DistributionPayload> = (
	payload: DistributionPayload,
	title: string,
	translate?: (key: string, params?: Record<string, unknown>) => string,
): ApexOptions => {
	const colors: string[] = [];
	const labels: string[] = [];
	const data: number[] = [];
	payload.data.forEach(di => {
		colors.push(di.color ?? 'var(--primary-color)');
		labels.push(di.name);
		data.push(di.amount);
	});

	return {
		...commonChartOptions,
		chart: {
			...getCommonChart(translate),
			type: 'polarArea',
		},
		series: data,
		colors,
		labels,
		plotOptions: {
			polarArea: {
				rings: {
					strokeColor: 'var(--apexchart-grid-color)',
				},
				spokes: {
					connectorColors: 'var(--apexchart-grid-color)',
				},
			},
		},
		dataLabels: {
			enabled: true,
			background: {
				enabled: true,
				padding: 8,
			},
			style: {
				fontSize: '14px',
			},
		},
		yaxis: {
			show: false,
			labels: {
				formatter(val) {
					return formatNumber(val);
				},
			},
		},
		fill: {
			opacity: 0.85,
		},
		title: {
			...commonChartOptions.title,
			text: truncateTitle(title),
		},
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
	radar: RadarProvider,
	treemap: TreemapProvider,
	scatter: ScatterProvider,
	polarArea: PolarAreaProvider,
};

export function mapToProvider<T extends WidgetDataPayload>(type: ExChartType): ProviderFn<T> {
	return CHART_PROVIDER_REGISTRY[type]! as ProviderFn<T>;
}
