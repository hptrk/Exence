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
import { ChartWidget } from '../Widget';

echarts.use([SankeyChart, TooltipComponent, TitleComponent, CanvasRenderer]);

@Component({
	selector: 'ex-sankey-chart',
	template: `
		<div
			echarts
			[options]="{
				...data(),
				title: {
					...data()?.title,
					text: this.widget().title,
				},
			}"
			style="height: 500px"
		></div>
	`,
	imports: [NgxEchartsDirective],
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
				this.data.set(providerFn(response.payload) as Partial<EChartsOption>);
				this.isLoading.set(false);
			});
		});
	}
}
