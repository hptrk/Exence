import { Component, effect, inject, input, signal } from '@angular/core';
import { SankeyChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts/types/dist/shared';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { Timeframe } from '../../../data-model/modules/statistics/Timeframe';
import { WidgetDataPayload } from '../../../data-model/modules/statistics/WidgetDataPayload';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { DisplayThemeService } from '../../../shared/display-theme.service';
import { mapToProvider } from '../chart-providers';
import { StatisticService } from '../statistic.service';
import { TranslocoService } from '@jsverse/transloco';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { ChartWidget } from '../../../data-model/modules/statistics/ChartWidget';
import { WidgetType } from '../../../data-model/modules/statistics/widget-config.model';

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
	providers: [provideEchartsCore({ echarts }), CurrencyPipe],
})
export class SankeyChartComponent {
	private readonly statisticService = inject(StatisticService);
	private readonly themeService = inject(DisplayThemeService);
	private readonly translocoService = inject(TranslocoService);
	private readonly currencyPipe = inject(CurrencyPipe);

	widget = input.required<ChartWidget>();
	timeframe = input.required<Timeframe>();

	private readonly cachedPayload = signal<WidgetDataPayload | undefined>(undefined);

	isLoading = signal<boolean>(false);
	data = signal<Partial<EChartsOption> | undefined>(undefined);

	constructor() {
		effect(() => {
			this.themeService.displayThemeSignal(); // dependency
			const timeframe = this.timeframe();

			this.isLoading.set(true);
			this.statisticService
				.getWidgetData(this.widget().id, timeframe)
				.then(response => {
					this.cachedPayload.set(response.payload);
				})
				.catch(() => {})
				.finally(() => this.isLoading.set(false));
		});

		effect(() => {
			this.themeService.displayThemeSignal(); // dependency
			const payload = this.cachedPayload();
			if (!payload) return;

			const providerFn = mapToProvider<typeof payload>('sankey');
			this.data.set(
				providerFn(
					payload,
					this.widget().title,
					this.translocoService.getActiveLang(),
					(key, params) => this.translocoService.translate(key, params),
					(v: number) => this.currencyPipe.transform(v),
					this.widget().type as WidgetType,
				) as Partial<EChartsOption>,
			);
		});
	}
}
