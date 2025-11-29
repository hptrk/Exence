import { Component, OnInit, OnDestroy, inject, computed, effect, viewChild } from '@angular/core';

import { BaseChartDirective } from 'ng2-charts';
import { Chart, Plugin } from 'chart.js';
import { DisplayTheme, DisplayThemeService } from '../display-theme.service';
import { createCustomBackgroundPlugin, getLineChartData, lineChartOptions } from './chart-config';
import { BaseComponent } from '../base-component/base.component';
// import { TransactionService } from '../../private/transactions/transaction.service';

@Component({
	selector: 'ex-chart',
	imports: [BaseChartDirective],
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss'],
})
export class ChartComponent extends BaseComponent implements OnInit, OnDestroy {
	// private transactionService = inject(TransactionService);
	private themeService = inject(DisplayThemeService);

	private chart = viewChild<BaseChartDirective>(BaseChartDirective);
	public lineChartOptions = lineChartOptions;
	private customBackgroundPlugin!: Plugin;

	// Computed properties
	// public balanceData = computed(() => {
	// 	let balance = 0;
	// 	return this.transactionService
	// 		.getTransactions()()
	// 		.map(transaction => {
	// 			balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
	// 			return balance;
	// 		});
	// });
	public balanceData = computed(() => [10, 0, 100]);
	// public chartLabels = computed(() =>
	// 	this.transactionService
	// 		.getTransactions()()
	// 		.map(t => t.title),
	// );
	public chartLabels = computed(() => ['dummylabel', 'dummylabel', 'dummylabel']);
	public lineChartData = computed(() => getLineChartData(this.balanceData(), this.chartLabels()));

	constructor() {
		super();

		effect(() => {
			if (this.chart()) {
				this.updateChartColors();
				this.registerCustomBackgroundPlugin();
			}
		});
	}

	ngOnInit() {
		this.initializeChart();
	}

	override ngOnDestroy() {
		super.ngOnDestroy();
		if (this.customBackgroundPlugin) {
			Chart.unregister(this.customBackgroundPlugin);
		}
	}

	private initializeChart() {
		// Create custom background plugin
		this.customBackgroundPlugin = createCustomBackgroundPlugin(
			this.themeService.currentTheme === DisplayTheme.DARK,
		);
		Chart.register(this.customBackgroundPlugin);
		this.updateChartColors();
	}

	private updateChartColors() {
		const backgroundColor =
			this.themeService.currentTheme === DisplayTheme.DARK
				? 'rgba(222, 222, 247, 0.1)'
				: 'rgba(222, 222, 247, 0.4)';

		if (this.lineChartData()) {
			this.lineChartData().datasets[0].backgroundColor = backgroundColor;
			this.chart()?.update();
		}

		this.chart()?.update();
	}

	private registerCustomBackgroundPlugin() {
		Chart.unregister(this.customBackgroundPlugin);
		this.customBackgroundPlugin = createCustomBackgroundPlugin(
			this.themeService.currentTheme === DisplayTheme.DARK,
		);
		Chart.register(this.customBackgroundPlugin);
		this.chart()?.update();
	}
}
