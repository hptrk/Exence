import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Timeframe } from '../../data-model/modules/statistics/Timeframe';
import { ChartWidget } from '../../data-model/modules/statistics/Widget';
import { WidgetDataPayload } from '../../data-model/modules/statistics/WidgetDataPayload';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CategoriesComponent, DateInterval } from '../../private/dashboard/categories/categories.component';
import { SummaryContainerComponent } from '../../private/dashboard/summary-container/summary-container.component';
import { BaseComponent } from '../../shared/base-component/base.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { CardSliderDirective } from '../../shared/card-slider.directive';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../shared/display-size.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { CurrentUserService } from '../../shared/user/current-user.service';
import { ChartWidgetComponent } from '../statistics/chart-widget/chart-widget.component';
import { StatisticService } from '../statistics/statistic.service';
import { CategoryStore } from '../transactions-and-categories/category.store';
import { CreateTransactionDialogComponent } from '../transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { TransactionStore } from '../transactions-and-categories/transaction.store';

@Component({
	selector: 'ex-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
	imports: [
		CommonModule,
		CardSliderDirective,
		SummaryContainerComponent,
		DataTableComponent,
		ChartWidgetComponent,
		CategoriesComponent,
		ButtonComponent,
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

	transactionTypes = TransactionType;
	dateIntervals = DateInterval;

	user = computed(() => this.currentUserService.user());
	categories = computed(() => this.categoryStore.categoryResource.value());
	transactions = computed(() => this.transactionStore.transactions());
	incomes = computed(() => this.transactionStore.incomes());
	expenses = computed(() => this.transactionStore.expenses());

	dashboardWidget = signal<ChartWidget | undefined>(undefined);
	dashboardPayload = signal<WidgetDataPayload | undefined>(undefined);
	chartTimeframe = signal<Timeframe>(Timeframe.YEAR_TO_DATE);

	constructor() {
		super();

		if (this.transactionStore.transactions().content?.length) this.transactionStore.resetState();

		effect(() => {
			console.log(this.chartTimeframe());
			this.statisticService.getDashboardChart(this.chartTimeframe()).then(response => {
				this.dashboardWidget.set({
					id: response.widgetId,
					type: response.type,
					title: '',
					info: '',
					timeframe: this.chartTimeframe(),
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
		await this.dialog.openNonModal(CreateTransactionDialogComponent, {
			type: transactionType,
		});
	}

	onScroll(type?: TransactionType): void {
		this.transactionStore.loadNextPage(type!);
	}
}
