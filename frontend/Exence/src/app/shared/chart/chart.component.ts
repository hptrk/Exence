import { afterNextRender, Component, computed, effect, inject, input, signal, viewChild } from '@angular/core';

import { Chart, ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { format } from 'date-fns';
import { BaseChartDirective } from 'ng2-charts';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { BaseComponent } from '../base-component/base.component';
import { DisplayThemeService } from '../display-theme.service';
import { createCanvasBackgroundPlugin, createPointerTooltipConfig, getCssVariableValue, getLineChartData, getLineChartOptions } from './chart-config';

@Component({
	selector: 'ex-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss'],
	imports: [
		BaseChartDirective,
	],
})
export class ChartComponent extends BaseComponent {
	private themeService = inject(DisplayThemeService);

	data = input.required<Transaction[]>();

	private chart = viewChild<BaseChartDirective>(BaseChartDirective);

	lineChartType: ChartType = 'line';
	balanceData = computed(() => {
		// has to come from backend later
		const sortedData = this.data().sort((a, b) => a.date.localeCompare(b.date));
		if (!sortedData.length) return [];
		
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
		this.data()
			.sort((a, b) => a.date.localeCompare(b.date))
			.map(transaction => format(new Date(transaction.date), 'dd/MM'))
	);
	lineChartData = signal<ChartData<'line'>>(getLineChartData());
	lineChartOptions = signal<ChartConfiguration['options']>(getLineChartOptions()); // colors, font style, etc.

	get canvas(): HTMLCanvasElement | undefined { return this.chart()?.chart?.canvas; }
	
	constructor() {
		super();

		// initial
		afterNextRender(() => {
			this.registerCanvasBackground();
			this.setThemeColors();
		});

		// when data changes
		effect(() => {
			this.data();
			this.balanceData();
			this.chartLabels();

			if (this.canvas) {
				this.setThemeColors();
			}
		});

		// when theme changes
		this.addSubscription(this.themeService.themeChangedEvent.subscribe(() => this.setThemeColors()));
	}

	private registerCanvasBackground(): void {
		const canvasBgPlugin = createCanvasBackgroundPlugin();
		Chart.register(canvasBgPlugin);
	}

	private setThemeColors(): void {
		if (!this.canvas) return;
		const element = this.canvas;

		// get colors
		const color = getCssVariableValue('--default-text-color', element);
		const colorGrid = getCssVariableValue('--border-color', element);
		const bgColor = getCssVariableValue('--primary-color', element);
		const hoverColor = getCssVariableValue('--app-hover-color', element);

		// update chart options with new colors
		this.lineChartOptions.set(getLineChartOptions(
			color,
			colorGrid,
			{ tooltip: createPointerTooltipConfig(this.data()) },
		));

		// update chart data with new colors
		this.lineChartData.set(getLineChartData(
			this.balanceData(),
			this.chartLabels(),
			bgColor,
			hoverColor,
		));
	}
}
