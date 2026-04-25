import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { ChartWidget } from '../../../../data-model/modules/statistics/ChartWidget';
import { Timeframe } from '../../../../data-model/modules/statistics/Timeframe';
import {
	ADMIN_CHART_TITLES,
	AdminWidgetType,
	StatisticsWidgetType,
} from '../../../../data-model/modules/statistics/widget-config.model';
import { WidgetDataPayload } from '../../../../data-model/modules/statistics/WidgetDataPayload';
import { ChartWidgetComponent } from '../../../statistics/chart-widget/chart-widget.component';
import { AdminStatisticsService } from '../../admin-statistic.service';

@Component({
	selector: 'ex-admin-chart',
	template: `
		@if (syntheticWidget() && payload()) {
			<ex-chart-widget
				data-testid="chart-widget"
				[widget]="syntheticWidget()!"
				[payload]="payload()"
				noRequest
				disableCurrencyFormat
				[editing]="false"
				(timeframeChanged)="timeframe.set($event)"
				[hideTimeframe]="true"
			/>
		}
	`,
	styles: `
		:host {
			height: 350px;
		}
	`,
	imports: [ChartWidgetComponent],
})
export class AdminChartComponent {
	private readonly adminStatisticsService = inject(AdminStatisticsService);
	private readonly translocoService = inject(TranslocoService);

	private readonly activeLang = toSignal(this.translocoService.langChanges$);

	type = input.required<AdminWidgetType>();
	timeframe = signal<Timeframe>(Timeframe.YEAR_TO_DATE);
	payload = signal<WidgetDataPayload | undefined>(undefined);

	readonly syntheticWidget = computed<ChartWidget | undefined>(() => {
		const lang = this.activeLang();
		if (!lang) return undefined;
		return {
			id: 0,
			type: this.type() as unknown as StatisticsWidgetType,
			title: this.translocoService.translate(ADMIN_CHART_TITLES[this.type()], {}, lang),
			timeframe: this.timeframe(),
			x: 0,
			y: 0,
			cols: 0,
			rows: 0,
		};
	});

	constructor() {
		effect(() => {
			this.adminStatisticsService.getWidgetData(this.type(), this.timeframe()).then(response => {
				this.payload.set(response.payload);
			});
		});
	}
}
