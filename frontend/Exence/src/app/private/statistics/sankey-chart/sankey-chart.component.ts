import { Component, effect, inject, input, signal } from '@angular/core';
import { SankeyChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts/types/dist/shared';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { DisplayThemeService } from '../../../shared/display-theme.service';
import { mapToProvider } from '../chart-providers';
import { StatisticService } from '../statistic.service';
import { ChartWidget } from '../../../data-model/modules/statistics/Widget';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';

echarts.use([SankeyChart, TooltipComponent, TitleComponent, CanvasRenderer]);

@Component({
	selector: 'ex-sankey-chart',
	template: `
		@if (isLoading() && !data()) {
			<div class="h-100 w-100 d-flex justify-content-center align-items-center">
				<div class="d-flex flex-row flex-nowrap gap-2 align-items-end justify-content-center">
					<ex-animated-skeleton-loader shape="rect" width="50px" height="155px" />
					<ex-animated-skeleton-loader shape="rect" width="50px" height="195px" />
					<ex-animated-skeleton-loader shape="rect" width="50px" height="250px" />
					<ex-animated-skeleton-loader shape="rect" width="50px" height="170px" />
					<ex-animated-skeleton-loader shape="rect" width="50px" height="120px" />
				</div>
			</div>
		} @else {
			<div echarts [options]="{ ...data() }" style="height: 450px"></div>
		}
	`,
	imports: [NgxEchartsDirective, AnimatedSkeletonLoaderComponent],
	providers: [provideEchartsCore({ echarts })],
})
export class SankeyChartComponent {
	private readonly statisticService = inject(StatisticService);
	private readonly themeService = inject(DisplayThemeService);

	widget = input.required<ChartWidget>();

	isLoading = signal<boolean>(false);
	data = signal<Partial<EChartsOption> | undefined>(undefined);

	constructor() {
		effect(() => {
			this.themeService.displayThemeSignal(); // dependency

			this.isLoading.set(true);
			this.statisticService.getWidgetData(this.widget().id).then(response => {
				const providerFn = mapToProvider<typeof response.payload>('sankey');
				this.data.set(providerFn(response.payload, this.widget().title) as Partial<EChartsOption>);
				this.isLoading.set(false);
			});
		});
	}
}
