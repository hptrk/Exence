import { Component, computed, inject, input, OnChanges, signal } from '@angular/core';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { mapToProvider } from '../chart-providers';
import { ExChartType } from '../ChartType';
import { StatisticService } from '../statistic.service';
import { ChartWidget } from '../Widget';
import { mapToExChartType } from '../widget-config.model';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'ex-chart-widget',
	templateUrl: './chart-widget.component.html',
	styleUrl: './chart-widget.component.scss',
	imports: [NgApexchartsModule, MatCardModule],
})
export class ChartWidgetComponent implements OnChanges {
	private readonly statisticService = inject(StatisticService);

	widget = input.required<ChartWidget>();

	type = computed<ExChartType>(() => mapToExChartType(this.widget().type));
	isApexChart = computed<boolean>(() => !['sankey', 'statCard'].includes(this.type()));

	isLoading = signal<boolean>(false);
	data = signal<Partial<ApexOptions> | undefined>(undefined);

	ngOnChanges(): void {
		this.isLoading.set(true);
		this.statisticService.getWidgetData(this.widget().id).then(response => {
			const providerFn = mapToProvider<typeof response.payload>(this.type());
			this.data.set(providerFn(response.payload) as Partial<ApexOptions>);
			this.isLoading.set(false);
		});
	}
}
