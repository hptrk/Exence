import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, OnChanges, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { InfoButtonComponent } from '../../../shared/info-button/info-button.component';
import { mapToProvider } from '../chart-providers';
import { StatisticService } from '../statistic.service';
import { StatCardWidget } from '../Widget';
import { mapToExChartType } from '../widget-config.model';
import { StatCardPayload } from '../WidgetDataPayload';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';

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
export class StatCardComponent implements OnChanges {
	private readonly statisticService = inject(StatisticService);

	widget = input.required<StatCardWidget>();

	// TODO remove when statistic.store created
	isLoading = signal<boolean>(false);
	data = signal<StatCardPayload | null>(null);
	trend = signal<'UP' | 'DOWN' | 'NEUTRAL'>('NEUTRAL');

	assets = computed<StatCardAssetInfo>(() => {
		switch (this.trend()) {
			case 'UP':
				return { prefix: '+', suffix: 'arrow_upward' };
			case 'DOWN':
				return { prefix: '-', suffix: 'arrow_downward' };
			default:
				return { prefix: '', suffix: 'check_indeterminate_small' };
		}
	});

	isMetric = computed(() => !!this.data()?.changePercentage && !!this.data()?.trend);

	// TODO move to statistic.store, remove async
	ngOnChanges(): void {
		this.isLoading.set(true);
		this.statisticService.getWidgetData<StatCardPayload>(this.widget().id).then(response => {
			const type = mapToExChartType(response.type);
			const providerFn = mapToProvider<StatCardPayload>(type);
			this.data.set(providerFn(response.payload) as StatCardPayload);
			this.isLoading.set(false);
		});
	}
}
