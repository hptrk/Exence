import { formatCurrency } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartTypeRegistry, PluginOptionsByType, TooltipItem, TooltipOptions } from 'chart.js';
import { Transaction } from '../../data-model/modules/transaction/Transaction';

export const getCssVariableValue = (
	variableName: string,
	element: HTMLElement | null | undefined = document.documentElement
): string => {
	if (!element) return '';
	return getComputedStyle(element).getPropertyValue(variableName).trim();
};

export const hexToRgba = (hex: string, alpha = 1): string => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const createCanvasBackgroundPlugin = (): {
	id: string;
	beforeDraw: (chart: Chart) => void;
} => ({
	id: 'customCanvasBackgroundColor',
	beforeDraw: (chart: Chart) => {
		const { ctx, canvas } = chart;
		const radius = 20;
		ctx.save();
		ctx.globalCompositeOperation = 'destination-over';
		
		ctx.fillStyle = getCssVariableValue('--app-card-color', canvas);

		// Draw rounded rectangle
		ctx.beginPath();
		ctx.roundRect(0, 0, chart.width, chart.height, radius);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	},
});

export const createPointerTooltipConfig = (
	data: Transaction[]
): TooltipOptions<'line'> => ({
	enabled: true,
	callbacks: {
		title: (context: TooltipItem<'line'>[]) => {
			const dataIndex = context[0]?.dataIndex;
			if (typeof dataIndex !== 'number') return '';
			const transaction = data[dataIndex];
			const title = transaction.title;
			return title.length > 15 ? title.slice(0, 15) + '...' : title;
		},
		label: (context: TooltipItem<'line'>) => {
			const dataIndex = context.dataIndex;
			if (typeof dataIndex !== 'number') return '';
			const transaction = data[dataIndex];
			return `Amount: ${formatCurrency(transaction.amount, 'en-US', 'Ft', 'hu-HU')}`;
		},
	}
} as TooltipOptions<'line'>);

export const getLineChartOptions = (
	color?: string,
	gridColor?: string,
	plugins?: Omit<Partial<PluginOptionsByType<keyof ChartTypeRegistry>>, 'legend'>
): ChartConfiguration['options'] => {
	return {
		responsive: true,
		maintainAspectRatio: false,
		layout: {
			padding: { top: 30, left: 30, right: 30, bottom: 30 },
		},
		animations: {
			tension: { duration: 2000 },
			backgroundClor: { duration: 0 }
		},
		elements: {
			line: { tension: 0.3 },
		},
		plugins: {
			legend: { display: false },
			...plugins
		},
		scales: {
			x: {
				grid: { color: gridColor },
				border: { color: gridColor },
				ticks: { color },
			},
			y: {
				beginAtZero: true,
				grid: { color: gridColor },
				border: { color: gridColor },
				ticks: { color },
			}
		}
	};
};

export const getLineChartData = (
	data?: number[],
	labels?: string[],
	bgColor?: string,
	hoverColor?: string,
): ChartData<'line'> => {
	return {
		labels: labels ?? [],
		datasets: [{
			data: data ?? [],
			fill: 'origin',
			pointRadius: 4,
			pointBorderWidth: 0,
			backgroundColor: hexToRgba(bgColor ?? '', 0.25),
			borderColor: bgColor,
			pointBackgroundColor: bgColor,
			pointHoverBackgroundColor: hoverColor,
		}]
	};
};