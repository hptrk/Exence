import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Timeframe } from '../../data-model/modules/statistics/Timeframe';
import { WidgetDataPayload } from '../../data-model/modules/statistics/WidgetDataPayload';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CategoriesComponent } from '../../private/dashboard/categories/categories.component';
import { SummaryContainerComponent } from '../../private/dashboard/summary-container/summary-container.component';
import { BaseComponent } from '../../shared/base-component/base.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { CardSliderDirective } from '../../shared/card-slider.directive';
import { TransactionListComponent } from '../transactions-and-categories/transaction-list/transaction-list.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../shared/display-size.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CurrentUserService } from '../../shared/user/current-user.service';
import { ChartWidgetComponent } from '../statistics/chart-widget/chart-widget.component';
import { StatisticService } from '../statistics/statistic.service';
import { CategoryStore } from '../transactions-and-categories/category.store';
import {
	CreateTransactionDialogComponent,
	CreateTransactionDialogData,
} from '../transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { TransactionStore } from '../transactions-and-categories/transaction.store';
import { ChartWidget } from '../../data-model/modules/statistics/ChartWidget';
import { TransactionCreate } from '../../data-model/modules/transaction/TransactionCreate';
import { RecurringTransactionCreate } from '../../data-model/modules/transaction/RecurringTransactionCreate';
import { RecurringStore } from '../transactions-and-categories/recurring.store';

@Component({
	selector: 'ex-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
	imports: [
		CommonModule,
		CardSliderDirective,
		SummaryContainerComponent,
		TransactionListComponent,
		ChartWidgetComponent,
		CategoriesComponent,
		ButtonComponent,
		TranslatePipe,
	],
	providers: [StatisticService],
})
export class DashboardComponent extends BaseComponent {
	private readonly currentUserService = inject(CurrentUserService);
	private readonly statisticService = inject(StatisticService);
	private readonly dialog = inject(DialogService);
	readonly display = inject(DisplaySizeService);
	readonly navigation = inject(NavigationService);
	readonly transactionStore = inject(TransactionStore);
	readonly categoryStore = inject(CategoryStore);
	readonly recurringStore = inject(RecurringStore);

	transactionTypes = TransactionType;

	user = computed(() => this.currentUserService.user());

	dashboardWidget = signal<ChartWidget | undefined>(undefined);
	dashboardPayload = signal<WidgetDataPayload | undefined>(undefined);
	chartTimeframe = signal<Timeframe>(Timeframe.YEAR_TO_DATE);

	constructor() {
		super();

		this.transactionStore.clearFilters();

		effect(() => {
			this.transactionStore.balance(); // dependency
			const timeframe = this.chartTimeframe();
			this.statisticService.getDashboardChart(timeframe).then(response => {
				this.dashboardWidget.set({
					id: response.widgetId,
					type: response.type,
					title: '',
					timeframe,
					x: 0,
					y: 0,
					cols: 0,
					rows: 0,
				});
				this.dashboardPayload.set(response.payload);
			});
		});
	}

	async openCreateTransactionDialog(transactionType: TransactionType): Promise<void> {
		const result = await this.dialog.openNonModal<
			CreateTransactionDialogData | undefined,
			TransactionCreate | RecurringTransactionCreate | null
		>(CreateTransactionDialogComponent, { type: transactionType });
		if (!result) return;
		if ('date' in result) this.transactionStore.createTransaction(result as TransactionCreate);
		else this.recurringStore.createRecurringTransaction(result as RecurringTransactionCreate);
	}
}
