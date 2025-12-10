import { Component, ElementRef, computed, inject, viewChild } from '@angular/core';

import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BaseComponent } from '../base-component/base.component';
import { DisplayThemeService } from '../display-theme.service';
import { createCanvasBackgroundPlugin, getCssVariableValue, getLineChartData, hexToRgba, lineChartOptions } from './chart-config';

@Component({
	selector: 'ex-chart',
	imports: [BaseChartDirective],
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss'],
})
export class ChartComponent extends BaseComponent {
	private themeService = inject(DisplayThemeService);
	private canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');

	private chart = viewChild<BaseChartDirective>(BaseChartDirective);
	
	public balanceData = computed(() => [10, 0, 100]);
	
	public chartLabels = computed(() => ['dummylabel', 'dummylabel', 'dummylabel']);
	public lineChartData = computed(() => getLineChartData(this.balanceData(), this.chartLabels()));
	public lineChartOptions = lineChartOptions;
	
	constructor() {
		super();
		this.setThemeColors()
		this.themeService.themeChangedEvent.subscribe(() => this.setThemeColors())
	}

	private setThemeColors(): void {
		if (!this.canvas) return;
		const element = this.canvas()?.nativeElement;

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
		if (this.lineChartOptions?.scales) {
			this.lineChartOptions.scales = {
				x: gridData,
				y: { beginAtZero: true, ...gridData }
			}
		}

		// line colors
		const bgColor = getCssVariableValue('--primary-color', element);
		
		const pointColors = {
			backgroundColor: hexToRgba(bgColor, 0.25),
			borderColor: getCssVariableValue('--primary-color', element),
			pointBackgroundColor: getCssVariableValue('--primary-color', element),
			pointHoverBackgroundColor: getCssVariableValue('--app-hover-color', element)
		};
		if (this.lineChartData) {
			const currDataset = this.lineChartData().datasets[0];
			this.lineChartData().datasets[0] = {
				...currDataset,
				...pointColors
			}; 
		}
	
		this.chart()?.update();
	}
}
