import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CategoriesComponent, DateInterval } from '../../private/dashboard/categories/categories.component';
import { SummaryContainerComponent } from '../../private/dashboard/summary-container/summary-container.component';
import { BaseComponent } from '../../shared/base-component/base.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { CardSliderDirective } from '../../shared/card-slider.directive';
import { ChartComponent } from '../../shared/chart/chart.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../shared/display-size.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { CurrentUserService } from '../../shared/user/current-user.service';
import { ViewToggleComponent } from '../../shared/view-toggle/view-toggle.component';
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
		ChartComponent,
		CategoriesComponent,
		ViewToggleComponent,
		ButtonComponent,
	],
})
export class DashboardComponent extends BaseComponent implements OnInit {
	private readonly currentUserService = inject(CurrentUserService);
	private readonly dialog = inject(DialogService);
	readonly display = inject(DisplaySizeService);
	readonly navigation = inject(NavigationService);
	readonly transactionStore = inject(TransactionStore);
	readonly categoryStore = inject(CategoryStore);

	transactionTypes = TransactionType;
	dateIntervals = DateInterval;

	user = computed(() => this.currentUserService.user());
	categories = computed(() => this.categoryStore.categoryResource.value());
	transactions = computed(() => this.transactionStore.data.transactions());
	incomes = computed(() => this.transactionStore.data.incomes());
	expenses = computed(() => this.transactionStore.data.expenses());

	ngOnInit(): void {
		if (this.transactionStore.data.transactions().content?.length) this.transactionStore.resetState();
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
