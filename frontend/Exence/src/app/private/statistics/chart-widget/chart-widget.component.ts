import { booleanAttribute, Component, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ExChartType } from '../../../data-model/modules/statistics/ChartType';
import { Timeframe } from '../../../data-model/modules/statistics/Timeframe';
import { ChartWidget } from '../../../data-model/modules/statistics/Widget';
import {
	mapToExChartType,
	TIMEFRAME_HIDDEN_WIDGET_TYPES,
} from '../../../data-model/modules/statistics/widget-config.model';
import { WidgetDataPayload } from '../../../data-model/modules/statistics/WidgetDataPayload';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { DisplayThemeService } from '../../../shared/display-theme.service';
import { mapToProvider } from '../chart-providers';
import { SankeyChartComponent } from '../sankey-chart/sankey-chart.component';
import { StatisticService } from '../statistic.service';
import { TimeframeComponent } from '../timeframe/timeframe.component';
import { TranslocoService } from '@jsverse/transloco';

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
	private readonly themeService = inject(DisplayThemeService);
	private readonly translocoService = inject(TranslocoService);

	widget = input.required<ChartWidget>();
	editing = input.required<boolean>();
	payload = input<WidgetDataPayload>();
	dashboardChart = input(false, { transform: booleanAttribute });

	readonly timeframeChanged = output<Timeframe>();

	private readonly chart = viewChild<ChartComponent>('chart');
	private readonly cachedPayload = signal<WidgetDataPayload | undefined>(undefined);

	type = computed<ExChartType>(() => mapToExChartType(this.widget().type));
	isApexChart = computed<boolean>(() => !['sankey', 'statCard'].includes(this.type()));
	showTimeframe = computed<boolean>(() => !TIMEFRAME_HIDDEN_WIDGET_TYPES.includes(this.widget().type));

	timeframe = signal<Timeframe>(Timeframe.YEAR_TO_DATE);
	isLoading = signal<boolean>(false);
	data = signal<Partial<ApexOptions> | undefined>(undefined);

	constructor() {
		super();

		effect(() => {
			this.timeframe.set(this.widget().timeframe);
		});

		effect(() => {
			this.timeframeChanged.emit(this.timeframe());
		});

		effect(() => {
			const timeframe = this.timeframe();
			this.isLoading.set(true);
			if (!this.isApexChart()) {
				this.isLoading.set(false);
				return;
			}

			if (this.dashboardChart() && this.payload()) {
				const payload = this.payload()!;
				const providerFn = mapToProvider<typeof payload>(this.type());
				this.data.set(providerFn(payload, this.widget().title) as Partial<ApexOptions>);
				this.isLoading.set(false);
				return;
			}

			this.statisticService
				.getWidgetData(this.widget().id, timeframe)
				.then(response => this.cachedPayload.set(response.payload))
				.catch(() => {})
				.finally(() => this.isLoading.set(false));
		});

		effect(() => {
			this.themeService.displayThemeSignal(); // dependency
			const payload = this.cachedPayload();
			if (!payload) return;

			const providerFn = mapToProvider<typeof payload>(this.type());
			this.data.set(
				providerFn(payload, this.widget().title, (key, params) =>
					this.translocoService.translate(key, params),
				) as Partial<ApexOptions>,
			);
		});
	}

	triggerRedraw(): void {
		if (!this.chart()) return;
		this.chart()!.toggleSeries('');
	}
}
