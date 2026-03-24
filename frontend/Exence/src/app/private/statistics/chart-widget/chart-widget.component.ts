import { Component, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { mapToProvider } from '../chart-providers';
import { ExChartType } from '../../../data-model/modules/statistics/ChartType';
import { Timeframe } from '../../../data-model/modules/statistics/Timeframe';
import { SankeyChartComponent } from '../sankey-chart/sankey-chart.component';
import { StatisticService } from '../statistic.service';
import { ChartWidget } from '../../../data-model/modules/statistics/Widget';
import {
	mapToExChartType,
	TIMEFRAME_HIDDEN_WIDGET_TYPES,
} from '../../../data-model/modules/statistics/widget-config.model';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { MatIconModule } from '@angular/material/icon';
import { TimeframeComponent } from '../timeframe/timeframe.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
	selector: 'ex-chart-widget',
	templateUrl: './chart-widget.component.html',
	styleUrl: './chart-widget.component.scss',
	imports: [
		NgApexchartsModule,
		MatCardModule,
		MatDividerModule,
		MatIconModule,
		SankeyChartComponent,
		AnimatedSkeletonLoaderComponent,
		TimeframeComponent,
	],
})
export class ChartWidgetComponent extends BaseComponent {
	private readonly statisticService = inject(StatisticService);

	widget = input.required<ChartWidget>();
	editing = input.required<boolean>();

	type = computed<ExChartType>(() => mapToExChartType(this.widget().type));
	isApexChart = computed<boolean>(() => !['sankey', 'statCard'].includes(this.type()));
	showTimeframe = computed<boolean>(() => !TIMEFRAME_HIDDEN_WIDGET_TYPES.includes(this.widget().type));

	private readonly chart = viewChild<ChartComponent>('chart');

	timeframe = signal<Timeframe>(Timeframe.YEAR_TO_DATE);
	isLoading = signal<boolean>(false);
	data = signal<Partial<ApexOptions> | undefined>(undefined);

	constructor() {
		super();

		effect(() => {
			this.timeframe.set(this.widget().timeframe);
		});

		effect(() => {
			const timeframe = this.timeframe();
			this.isLoading.set(true);
			if (!this.isApexChart()) {
				this.isLoading.set(false);
				return;
			}

			this.statisticService.getWidgetData(this.widget().id, timeframe).then(response => {
				const providerFn = mapToProvider<typeof response.payload>(this.type());
				this.data.set(providerFn(response.payload, this.widget().title) as Partial<ApexOptions>);
				this.isLoading.set(false);
			});
		});
	}

	triggerRedraw(): void {
		if (!this.chart()) return;
		this.chart()!.toggleSeries('');
	}
}
