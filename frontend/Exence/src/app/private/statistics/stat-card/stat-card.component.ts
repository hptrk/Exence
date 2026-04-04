import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StatCardWidget } from '../../../data-model/modules/statistics/Widget';
import { WidgetType } from '../../../data-model/modules/statistics/widget-config.model';
import { StatCardPayload } from '../../../data-model/modules/statistics/WidgetDataPayload';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { StatisticService } from '../statistic.service';
import { CurrencyPipe } from '@angular/common';
import { CurrencyService } from '../../../shared/currency.service';

interface StatCardAssetInfo {
	prefix: string;
	suffix: string;
}

@Component({
	selector: 'ex-stat-card',
	templateUrl: './stat-card.component.html',
	styleUrl: './stat-card.component.scss',
	imports: [MatCardModule, MatIconModule, AnimatedSkeletonLoaderComponent, CurrencyPipe],
})
export class StatCardComponent {
	private readonly statisticService = inject(StatisticService);
	readonly currencyService = inject(CurrencyService);

	widget = input.required<StatCardWidget>();

	isLoading = signal<boolean>(false);
	data = signal<StatCardPayload | null>(null);

	trend = computed<'UP' | 'DOWN' | 'NEUTRAL' | undefined>(() => this.data()?.trend);

	assets = computed<StatCardAssetInfo>(() => {
		switch (this.trend()) {
			case 'UP':
				return { prefix: '+', suffix: 'arrow_upward' };
			case 'DOWN':
				return { prefix: '', suffix: 'arrow_downward' };
			default:
				return { prefix: '', suffix: 'check_indeterminate_small' };
		}
	});

	hasIcon = computed(() => this.data()?.icon && !!this.data()?.iconColor);

	readonly predefinedStatCardIcons: Partial<Record<WidgetType, string>> = {
		[WidgetType.TOP_EXPENSE_CATEGORY_STATCARD]: 'money_off',
		[WidgetType.TOP_INCOME_CATEGORY_STATCARD]: 'attach_money',
	};

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
