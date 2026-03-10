import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StatCardWidget } from '../../../data-model/modules/statistics/Widget';
import { StatCardPayload } from '../../../data-model/modules/statistics/WidgetDataPayload';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { InfoButtonComponent } from '../../../shared/info-button/info-button.component';
import { StatisticService } from '../statistic.service';

interface StatCardAssetInfo {
	prefix: string;
	suffix: string;
}

@Component({
	selector: 'ex-stat-card',
	templateUrl: './stat-card.component.html',
	styleUrl: './stat-card.component.scss',
	imports: [MatCardModule, MatIconModule, InfoButtonComponent, AnimatedSkeletonLoaderComponent, CurrencyPipe],
})
export class StatCardComponent {
	private readonly statisticService = inject(StatisticService);

	widget = input.required<StatCardWidget>();

	isLoading = signal<boolean>(false);
	data = signal<StatCardPayload | null>(null);
	trend = computed<'UP' | 'DOWN' | 'NEUTRAL' | undefined>(() => this.data()?.trend);

	assets = computed<StatCardAssetInfo>(() => {
		console.log(this.trend());
		switch (this.trend()) {
			case 'UP':
				return { prefix: '+', suffix: 'arrow_upward' };
			case 'DOWN':
				return { prefix: '', suffix: 'arrow_downward' };
			default:
				return { prefix: '', suffix: 'check_indeterminate_small' };
		}
	});

	isMetric = computed(() => !!this.data()?.changePercentage && !!this.data()?.trend);

	constructor() {
		effect(() => {
			this.isLoading.set(true);
			this.statisticService.getWidgetData<StatCardPayload>(this.widget().id).then(response => {
				this.data.set(response.payload);
				this.isLoading.set(false);
			});
		});
	}
}
