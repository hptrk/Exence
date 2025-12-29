import { formatCurrency } from '@angular/common';
import { Chart, ChartConfiguration, TooltipItem } from 'chart.js';
import { Transaction } from '../../data-model/modules/transaction/Transaction';

export const getCssVariableValue = (variableName: string, element: HTMLElement | null = document.documentElement): string => {
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

export const createPointerTooltipConfig = (data: Transaction[]): {
	callbacks: {
		title: (context: TooltipItem<'line'>[]) => string;
		label: (context: TooltipItem<'line'>) => string;
	};
} => ({
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
	},
});

export const getLineChartData = (data: number[], labels: string[]): {
	labels: string[];
	datasets: {
		data: number[];
		fill: string;
		pointRadius: number;
		pointBorderWidth: number;
	}[];
} => ({
	labels,
	datasets: [
		{
			data,
			fill: 'origin',
			pointRadius: 4,
			pointBorderWidth: 0,
		},
	],
});

export const lineChartOptions: ChartConfiguration['options'] = {
	responsive: true,
	maintainAspectRatio: false,
	layout: {
		padding: { top: 30, left: 30, right: 30, bottom: 30 },
	},
	animations: {
		tension: {
			duration: 2000,
		},
		backgroundColor: {
			duration: 0,
		},
	},
	elements: {
		line: {
			tension: 0.3, // Smoothen the line
		},
	},
	plugins: {
		legend: { display: false },
	},
	scales: {
		x: {
		},
		y: {
			beginAtZero: true,
		},
	},
};
