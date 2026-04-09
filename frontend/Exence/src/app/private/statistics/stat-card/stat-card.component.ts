import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StatCardWidget } from '../../../data-model/modules/statistics/StatCardWidget';
import {
	AdminWidgetType,
	DebtWidgetType,
	GoalWidgetType,
	InvestmentWidgetType,
	WidgetType,
} from '../../../data-model/modules/statistics/widget-config.model';
import { StatCardPayload } from '../../../data-model/modules/statistics/WidgetDataPayload';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { CurrencyService } from '../../../shared/currency.service';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { AdminStatisticsService } from '../../admin/admin-statistic.service';
import { GoalService } from '../../goals/goal.service';
import { DebtService } from '../../debts/debt.service';
import { InvestmentService } from '../../investments/investment.service';
import { StatisticService } from '../statistic.service';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';

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
	private readonly adminStatisticService = inject(AdminStatisticsService);
	private readonly goalService = inject(GoalService);
	private readonly debtService = inject(DebtService);
	private readonly investmentService = inject(InvestmentService);
	readonly currencyService = inject(CurrencyService);

	widget = input<StatCardWidget>();
	adminCardType = input<AdminWidgetType>();
	goalCardType = input<GoalWidgetType>();
	debtCardType = input<DebtWidgetType>();
	investmentCardType = input<InvestmentWidgetType>();
	customTitle = input<string>();

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

	unitIsCurrency = computed<boolean>(() => {
		if (!this.data()?.unit) return false;
		const currency = this.unitToCurrency(this.data()!.unit);
		return !!currency && Object.values(SupportedCurrency).includes(currency);
	});

	readonly predefinedStatCardIcons: Partial<Record<WidgetType, string>> = {
		[WidgetType.TOP_EXPENSE_CATEGORY_STATCARD]: 'money_off',
		[WidgetType.TOP_INCOME_CATEGORY_STATCARD]: 'attach_money',
	};

	constructor() {
		effect(() => {
			if (!this.widget()) return;
			this.isLoading.set(true);
			this.statisticService
				.getWidgetData<StatCardPayload>(this.widget()!.id)
				.then(response => this.data.set(response.payload))
				.finally(() => this.isLoading.set(false));
		});

		effect(() => {
			if (!this.adminCardType()) return;
			this.isLoading.set(true);
			this.adminStatisticService
				.getWidgetData(this.adminCardType()!)
				.then(response => this.data.set(response.payload as StatCardPayload))
				.finally(() => this.isLoading.set(false));
		});

		effect(() => {
			this.currencyService.baseCurrency();
			this.currencyService.showBaseCurrency();
			if (!this.goalCardType()) return;
			this.isLoading.set(true);
			this.goalService
				.getWidgetData(this.goalCardType()!)
				.then(response => this.data.set(response.payload as StatCardPayload))
				.finally(() => this.isLoading.set(false));
		});

		effect(() => {
			this.currencyService.baseCurrency();
			this.currencyService.showBaseCurrency();
			if (!this.debtCardType()) return;
			this.isLoading.set(true);
			this.debtService
				.getWidgetData(this.debtCardType()!)
				.then(response => this.data.set(response.payload as StatCardPayload))
				.finally(() => this.isLoading.set(false));
		});

		effect(() => {
			this.currencyService.baseCurrency();
			this.currencyService.showBaseCurrency();
			if (!this.investmentCardType()) return;
			this.isLoading.set(true);
			this.investmentService
				.getWidgetData(this.investmentCardType()!)
				.then(response => this.data.set(response.payload as StatCardPayload))
				.finally(() => this.isLoading.set(false));
		});
	}

	unitToCurrency(unit: string): SupportedCurrency | undefined {
		return Object.values(SupportedCurrency).find(c => c === unit);
	}
}
