import { Chart, ChartConfiguration } from 'chart.js';
import { DisplayTheme } from '../display-theme.service';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { format } from 'date-fns';
import { formatCurrency } from '@angular/common';

export const getCssVariableValue = (variableName: string, element: HTMLElement | null = document.documentElement): string => {
    if (!element) return '';
    return getComputedStyle(element).getPropertyValue(variableName).trim();
};

export const hexToRgba = (hex: string, alpha: number = 1): string => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const createCanvasBackgroundPlugin = () => ({
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

export const createPointerTooltipConfig = (data: Transaction[], balance: number) => ({
	 callbacks: {
        title: (context: any) => {
            const transaction = data[context[0].dataIndex];
			const title = transaction.title ?? '';
			return title.length > 15 ? title.slice(0, 15) + '...' : title;
        },
        label: (context: any) => {
			const transaction = data[context.dataIndex];
			// In your function:
			return `Amount: ${formatCurrency(transaction.amount, 'en-US', 'Ft', 'hu-HU')}`;
        },
        afterLabel: (context: any) => {
			const transaction = data[context.dataIndex];
			// TODO balance
			return `Balance: ${formatCurrency(balance, 'en-US', 'Ft', 'hu-HU')}`;
        },
    },
});

export const getLineChartData = (data: number[], labels: string[]) => ({
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
		tooltip: {
            callbacks: {
                title: (context) => {
                    // Customize the title (usually the label)
                    return `Date: ${context[0].label}`;
                },
                label: (context) => {
                    // Customize the value display
                    return `Amount: $${context.parsed.y.toFixed(2)}`;
                },
                // Optional: add more info
                afterLabel: (context) => {
                    return `Additional info here`;
                },
            },
        },
	},
	scales: {
		x: {
		},
		y: {
			beginAtZero: true,
		},
	},
};
