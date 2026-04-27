import { booleanAttribute, Component, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoService } from '@jsverse/transloco';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ExChartType } from '../../../data-model/modules/statistics/ChartType';
import { ChartWidget } from '../../../data-model/modules/statistics/ChartWidget';
import { Timeframe } from '../../../data-model/modules/statistics/Timeframe';
import {
	mapToExChartType,
	StatisticsWidgetType,
	TIMEFRAME_HIDDEN_WIDGET_TYPES,
} from '../../../data-model/modules/statistics/widget-config.model';
import { WidgetDataPayload } from '../../../data-model/modules/statistics/WidgetDataPayload';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { DisplayThemeService } from '../../../shared/display-theme.service';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { mapToProvider } from '../chart-providers';
import { SankeyChartComponent } from '../sankey-chart/sankey-chart.component';
import { StatisticService } from '../statistic.service';
import { TimeframeComponent } from '../timeframe/timeframe.component';

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
	providers: [CurrencyPipe],
})
export class ChartWidgetComponent extends BaseComponent {
	private readonly statisticService = inject(StatisticService);
	private readonly themeService = inject(DisplayThemeService);
	private readonly translocoService = inject(TranslocoService);
	private readonly currencyPipe = inject(CurrencyPipe);

	widget = input.required<ChartWidget>();
	editing = input.required<boolean>();
	payload = input<WidgetDataPayload>();
	noRequest = input(false, { transform: booleanAttribute });
	hideTimeframe = input(false, { transform: booleanAttribute });
	disableCurrencyFormat = input(false, { transform: booleanAttribute });
	currency = input<SupportedCurrency | undefined>(undefined);

	readonly timeframeChanged = output<Timeframe>();

	private readonly chart = viewChild<ChartComponent>('chart');
	private readonly cachedPayload = signal<WidgetDataPayload | undefined>(undefined);
	private readonly activeLang = toSignal(this.translocoService.langChanges$, {
		initialValue: this.translocoService.getActiveLang(),
	});

	type = computed<ExChartType>(() => mapToExChartType(this.widget().type));
	isApexChart = computed<boolean>(() => !['sankey', 'statCard'].includes(this.type()));
	showTimeframe = computed<boolean>(
		() =>
			!TIMEFRAME_HIDDEN_WIDGET_TYPES.includes(this.widget().type as StatisticsWidgetType) &&
			!this.hideTimeframe(),
	);

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
			const currency = this.currency();
			this.isLoading.set(true);
			if (!this.isApexChart()) {
				this.isLoading.set(false);
				return;
			}

			if (this.noRequest()) {
				if (this.payload()) {
					const payload = this.payload()!;
					const providerFn = mapToProvider<typeof payload>(this.type());
					const currencyFormatter = this.disableCurrencyFormat()
						? undefined
						: (v: number) => this.currencyPipe.transform(v, currency);
					this.data.set(
						providerFn(
							payload,
							this.widget().title,
							this.translocoService.getActiveLang(),
							undefined,
							currencyFormatter,
							this.widget().type as StatisticsWidgetType,
						) as Partial<ApexOptions>,
					);
					this.isLoading.set(false);
				}
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
			this.activeLang(); // dependency - re-render chart when language changes
			const currency = this.currency();
			const payload = (this.noRequest() ? this.payload() : undefined) ?? this.cachedPayload();
			if (!payload) return;
			console.log(payload, typeof payload, this.widget().type, this.type());
			const providerFn = mapToProvider<typeof payload>(this.type());
			const currencyFormatter = this.disableCurrencyFormat()
				? undefined
				: (v: number) => this.currencyPipe.transform(v, currency);
			this.data.set(
				providerFn(
					payload,
					this.widget().title,
					this.translocoService.getActiveLang(),
					(key, params) => this.translocoService.translate(key, params),
					currencyFormatter,
					this.widget().type as StatisticsWidgetType,
				) as Partial<ApexOptions>,
			);
		});
	}

	triggerRedraw(): void {
		if (!this.chart()) return;
		this.chart()!.toggleSeries('');
	}
}
