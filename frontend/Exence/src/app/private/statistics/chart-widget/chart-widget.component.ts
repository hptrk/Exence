import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { mapToProvider } from '../chart-providers';
import { ExChartType } from '../../../data-model/modules/statistics/ChartType';
import { SankeyChartComponent } from '../sankey-chart/sankey-chart.component';
import { StatisticService } from '../statistic.service';
import { ChartWidget } from '../../../data-model/modules/statistics/Widget';
import { mapToExChartType } from '../../../data-model/modules/statistics/widget-config.model';

@Component({
	selector: 'ex-chart-widget',
	templateUrl: './chart-widget.component.html',
	styleUrl: './chart-widget.component.scss',
	imports: [NgApexchartsModule, MatCardModule, SankeyChartComponent],
})
export class ChartWidgetComponent {
	private readonly statisticService = inject(StatisticService);

	widget = input.required<ChartWidget>();

	type = computed<ExChartType>(() => mapToExChartType(this.widget().type));
	isApexChart = computed<boolean>(() => !['sankey', 'statCard'].includes(this.type()));

	isLoading = signal<boolean>(false);
	data = signal<Partial<ApexOptions> | undefined>(undefined);

	constructor() {
		effect(() => {
			this.isLoading.set(true);
			this.statisticService.getWidgetData(this.widget().id).then(response => {
				const providerFn = mapToProvider<typeof response.payload>(this.type());
				this.data.set(providerFn(response.payload, this.widget().title) as Partial<ApexOptions>);
				this.isLoading.set(false);
			});
		});
	}
}
