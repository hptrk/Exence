import { Component, computed, effect, inject, input, viewChild } from '@angular/core';

import { Chart } from 'chart.js';
import { format } from 'date-fns';
import { BaseChartDirective } from 'ng2-charts';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { BaseComponent } from '../base-component/base.component';
import { DisplayThemeService } from '../display-theme.service';
import { createCanvasBackgroundPlugin, createPointerTooltipConfig, getCssVariableValue, getLineChartData, hexToRgba, lineChartOptions } from './chart-config';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';

@Component({
	selector: 'ex-chart',
	imports: [BaseChartDirective],
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss'],
})
export class ChartComponent extends BaseComponent {
	private themeService = inject(DisplayThemeService);

	data = input.required<Transaction[]>();
	balance = input.required<number>();

	private chart = viewChild<BaseChartDirective>(BaseChartDirective);

	balanceData = computed(() => {
		// has to come from backend later
    const sortedData = this.data()?.sort((a, b) => a.date.localeCompare(b.date));
    if (!sortedData) return [];
    
    let currentBalance = 0;
    return sortedData.map(transaction => {
        if (transaction.type === TransactionType.INCOME) {
            currentBalance += transaction.amount;
        } else {
            currentBalance -= transaction.amount;
        }
        return currentBalance;
    });
	});

	chartLabels = computed(() =>
		this.data()?.sort((a, b) => a.date.localeCompare(b.date)).map(transaction => format(new Date(transaction.date), 'dd/MM'))
	);
	lineChartData = computed(() => 
		getLineChartData(this.balanceData(), this.chartLabels())
	);

	lineChartOptions = lineChartOptions;

	get canvas(): HTMLCanvasElement | undefined {
		return this.chart()?.chart?.canvas;
	}
	
	constructor() {
		super();

		effect(() => {
			const chart = this.chart();
			const data = this.data();
			
			if (chart && this.canvas && data) {
				this.setThemeColors();
			}
		});

		this.addSubscription(this.themeService.themeChangedEvent.subscribe(() => this.setThemeColors()));
	}

	private setThemeColors(): void {
		if (!this.canvas) return;
		const element = this.canvas!;

		// background
		const canvasBgPlugin = createCanvasBackgroundPlugin();
		Chart.register(canvasBgPlugin);

		// grid colors
		const color = getCssVariableValue('--default-text-color', element);
		const colorGrid = getCssVariableValue('--border-color', element);
		const gridColors = {
			color: colorGrid,
			borderColor: colorGrid
		};

		const gridData = {
			grid: gridColors,
			ticks: { color: color }
		};
		
		// new object reference is needed to trigger change detection
		this.lineChartOptions = {
			...this.lineChartOptions,
			scales: {
				x: gridData,
				y: { beginAtZero: true, ...gridData }
			},
			plugins: {
				...this.lineChartOptions?.plugins, // point tooltips
				tooltip: createPointerTooltipConfig(this.data(), this.balance()),
			}
		};

		// line colors
		const bgColor = getCssVariableValue('--primary-color', element);
		
		const pointColors = {
			backgroundColor: hexToRgba(bgColor, 0.25),
			borderColor: getCssVariableValue('--primary-color', element),
			pointBackgroundColor: getCssVariableValue('--primary-color', element),
			pointHoverBackgroundColor: getCssVariableValue('--app-hover-color', element)
		};
		const lineData = this.lineChartData();
		if (lineData) {
			const currDataset = lineData.datasets[0];
			lineData.datasets[0] = {
				...currDataset,
				...pointColors
			}; 
		}
	
		this.chart()?.update();
	}
}
