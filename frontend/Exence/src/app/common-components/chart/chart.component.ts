import { Component, OnInit, OnDestroy, inject, computed, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, Plugin } from 'chart.js';
import { ThemeService } from '../../services/theme.service';
import { createCustomBackgroundPlugin, getLineChartData, lineChartOptions } from './chart-config';
import { TransactionService } from '../../services/transaction.service';

@Component({
	selector: 'ex-chart',
	imports: [CommonModule, BaseChartDirective],
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy {
	private transactionService = inject(TransactionService);
	private themeService = inject(ThemeService);

	private chart = viewChild<BaseChartDirective>(BaseChartDirective);
	public lineChartOptions = lineChartOptions;
	private customBackgroundPlugin!: Plugin;

	// Computed properties
	public balanceData = computed(() => {
		let balance = 0;
		return this.transactionService
			.getTransactions()()
			.map(transaction => {
				balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
				return balance;
			});
	});
	public chartLabels = computed(() =>
		this.transactionService
			.getTransactions()()
			.map(t => t.title),
	);
	public lineChartData = computed(() => getLineChartData(this.balanceData(), this.chartLabels()));
	public isDarkMode = computed(() => this.themeService.isDarkTheme()());

	// theme change effect
	private themeEffect = effect(() => {
		if (this.chart()) {
			this.updateChartColors();
			this.registerCustomBackgroundPlugin();
		}
	});

	ngOnInit() {
		this.initializeChart();
	}

	ngOnDestroy() {
		if (this.customBackgroundPlugin) {
			Chart.unregister(this.customBackgroundPlugin);
		}
	}

	private initializeChart() {
		// Create custom background plugin
		this.customBackgroundPlugin = createCustomBackgroundPlugin(this.isDarkMode());
		Chart.register(this.customBackgroundPlugin);
		this.updateChartColors();
	}

	private updateChartColors() {
		const backgroundColor = this.isDarkMode() ? 'rgba(222, 222, 247, 0.1)' : 'rgba(222, 222, 247, 0.4)';

		if (this.lineChartData()) {
			this.lineChartData().datasets[0].backgroundColor = backgroundColor;
			this.chart()?.update();
		}

		this.chart()?.update();
	}

	private registerCustomBackgroundPlugin() {
		Chart.unregister(this.customBackgroundPlugin);
		this.customBackgroundPlugin = createCustomBackgroundPlugin(this.isDarkMode());
		Chart.register(this.customBackgroundPlugin);
		this.chart()?.update();
	}
}
