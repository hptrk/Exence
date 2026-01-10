import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
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
import { DisplaySizeService } from '../../shared/display-size.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { CurrentUserService } from '../../shared/user/current-user.service';
import { ViewToggleComponent } from '../../shared/view-toggle/view-toggle.component';
import { CategoryService } from '../category.service';
import { CreateTransactionDialogComponent, CreateTransactionDialogData } from '../transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
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
	private readonly snackbarService = inject(SnackbarService);
	readonly display = inject(DisplaySizeService);
	readonly dialog = inject(MatDialog);
	readonly router = inject(Router);
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

	public openCreateTransactionDialog(transactionType: TransactionType): void {
		const data: CreateTransactionDialogData = {
			type: transactionType,
		};
		this.dialog.open<CreateTransactionDialogComponent, CreateTransactionDialogData, Transaction>(
			CreateTransactionDialogComponent, { data }
		).afterClosed().subscribe(
			async (newTransaction?: Transaction) => {
				if (newTransaction) {
					this.transactions = (await this.transactionService.list());
					this.snackbarService.showSuccess(`Transaction '${newTransaction.title.slice(0, 10)}${newTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
				}
			});
	}

	async onDataChanged(): Promise<void> {
		await this.initialize();
	}
}
