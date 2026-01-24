import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Category } from '../../data-model/modules/category/Category';
import { CategorySummaryResponse } from '../../data-model/modules/category/CategorySummaryResponse';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionTotalsResponse } from '../../data-model/modules/transaction/TransactionTotalsResponse';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CategoriesComponent, DateInterval } from '../../private/dashboard/categories/categories.component';
import {
	SummaryContainerComponent
} from '../../private/dashboard/summary-container/summary-container.component';
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
import { CategoryService } from '../category.service';
import { CreateTransactionDialogComponent } from '../transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { TransactionService } from '../transactions-and-categories/transaction.service';

@Component({
	selector: 'ex-dashboard',
	imports: [
		CommonModule,
		RouterModule,
		CardSliderDirective,
		SummaryContainerComponent,
		DataTableComponent,
		ChartComponent,
		CategoriesComponent,
		ViewToggleComponent,
		ButtonComponent,
	],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent extends BaseComponent implements OnInit {
	private readonly currentUserService = inject(CurrentUserService);
	private readonly transactionService = inject(TransactionService);
	private readonly categoryService = inject(CategoryService);
	private readonly dialog = inject(DialogService);
	readonly display = inject(DisplaySizeService);
	readonly navigation = inject(NavigationService);

	transactionTypes = TransactionType;
	dateIntervals = DateInterval;

	user = computed(() => this.currentUserService.user());

	transactions: PagedResponse<Transaction> = {} as PagedResponse<Transaction>;
	expenses: PagedResponse<Transaction> = {} as PagedResponse<Transaction>;
	incomes: PagedResponse<Transaction> = {} as PagedResponse<Transaction>;
	categories: Category[] = [];

	totals: TransactionTotalsResponse = {} as TransactionTotalsResponse;
	balance = 0;

	topCategories?: CategorySummaryResponse[];
	topCategory?: CategorySummaryResponse;

	async ngOnInit(): Promise<void> {
		await this.initialize();
	}

	async initialize(): Promise<void> {
		return Promise.all([
			this.transactionService.list(),
			this.categoryService.list(),
			this.categoryService.listTop4(),
			this.transactionService.incomes(),
			this.transactionService.expenses(),
			this.transactionService.totals(),
		]).then(([transactions, categories, top4, incomes, expenses, totals]) => {
			this.transactions = transactions;
			this.categories = categories;
			this.incomes = incomes;
			this.expenses = expenses;
			this.totals = totals;
			this.topCategories = top4;
			
			this.balance = Math.round((totals.totalIncome - totals.totalExpense) * 100) / 100;
			this.topCategory = top4[0];
		});
	}

	public async openCreateTransactionDialog(transactionType: TransactionType): Promise<void> {
		const result = await this.dialog.openNonModal(
			CreateTransactionDialogComponent, { type: transactionType }
		);
		if (!result) return;
		this.transactions = await this.transactionService.list();
	}


	async onDataChanged(): Promise<void> {
		await this.initialize();
	}
}
