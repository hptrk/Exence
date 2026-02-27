import { Component, computed, inject, input, OnChanges, signal } from '@angular/core';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { ExChartType } from '../ChartType';
import { ChartWidget } from '../Widget';
import { mapToProvider } from '../chart-providers';
import { StatisticService } from '../statistic.service';
import { mapToExChartType } from '../widget-config.model';

@Component({
	selector: 'ex-chart-widget',
	templateUrl: './chart-widget.component.html',
	styleUrl: './chart-widget.component.scss',
	imports: [NgApexchartsModule],
})
export class ChartWidgetComponent implements OnChanges {
	private readonly statisticService = inject(StatisticService);

	widget = input.required<ChartWidget>();

	type = computed<ExChartType>(() => mapToExChartType(this.widget().type));
	isApexChart = computed<boolean>(() => !['sankey', 'statCard'].includes(this.type()));

	isLoading = signal<boolean>(false);
	data = signal<Partial<ApexOptions>>({});

	ngOnChanges(): void {
		this.isLoading.set(true);
		this.statisticService.getWidgetData(this.widget().id).then(response => {
			const providerFn = mapToProvider<typeof response.data>(this.type());
			this.data.set(providerFn(response.data) as Partial<ApexOptions>);
			this.isLoading.set(false);
		});
	}
}
