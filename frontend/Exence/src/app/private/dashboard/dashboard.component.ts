import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
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
import { CardSliderDirective } from '../../shared/card-slider.directive';
import { ChartComponent } from '../../shared/chart/chart.component';
import { DataTableDialogComponent } from '../../shared/data-table/data-table-dialog/data-table-dialog.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { DisplaySizeService } from '../../shared/display-size.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { ViewToggleComponent } from '../../shared/view-toggle/view-toggle.component';
import { CategoryService } from '../category.service';
import { CurrentUserService } from '../current-user.service';
import { TransactionService } from '../transactions-and-categories/transaction.service';

@Component({
	selector: 'ex-dashboard',
	imports: [
		SummaryContainerComponent,
		DataTableComponent,
		ChartComponent,
		CategoriesComponent,
		ViewToggleComponent,
		CommonModule,
		MatButton,
		CardSliderDirective,
		RouterModule,
	],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
	public display = inject(DisplaySizeService);
	public dialog = inject(MatDialog);
	public router = inject(Router);
	public navigation = inject(NavigationService);
	private readonly currentUserService = inject(CurrentUserService);
	private readonly transactionService = inject(TransactionService);
	private readonly categoryService = inject(CategoryService);

	transactionTypes = TransactionType;
	dateIntervals = DateInterval;

	user = computed(() => this.currentUserService.user());

	transactions: PagedResponse<Transaction> = {} as PagedResponse<Transaction>;
	expenses: PagedResponse<Transaction> = {} as PagedResponse<Transaction>;
	incomes: PagedResponse<Transaction> = {} as PagedResponse<Transaction>;
	categories: Category[] = [];

	totals: TransactionTotalsResponse = {} as TransactionTotalsResponse;
	balance?: number;

	topCategories?: CategorySummaryResponse[];
	topCategory?: CategorySummaryResponse;

	async ngOnInit(): Promise<void> {
		await this.initialize();
	}

	async initialize(): Promise<void> {
		return Promise.all([
			this.getTransactions(),
			this.getCategories(),
			this.getTop4Categories(),
			this.getIncomes(),
			this.getExpenses(),
			this.getTotals(),
		]).then(([transactions, categories, top4, incomes, expenses, totals]) => {
			this.transactions = transactions;
			this.categories = categories;
			this.incomes = incomes;
			this.expenses = expenses;
			this.totals = totals;
			
			this.balance = totals.totalIncome - totals.totalExpense;

			this.topCategories = top4;
			this.topCategory = top4[0];
		});
	}

	private getTransactions(): Promise<PagedResponse<Transaction>> {
		return this.transactionService.list();
	}

	private getCategories(): Promise<Category[]> {
		return this.categoryService.list();
	}

	private getTop4Categories(): Promise<CategorySummaryResponse[]> {
		return this.categoryService.listTop4();
	}

	private getIncomes(): Promise<PagedResponse<Transaction>> {
		return this.transactionService.incomes();
	}

	private getExpenses(): Promise<PagedResponse<Transaction>> {
		return this.transactionService.expenses();
	}

	private getTotals(): Promise<TransactionTotalsResponse> {
		return this.transactionService.totals();
	}

	public openTransactionDialog(transactionType: TransactionType): void {
		switch (transactionType) {
			case TransactionType.INCOME: {
				// temp: open a dialog
				this.dialog.open(DataTableDialogComponent, {
					width: 'auto',
					data: {
						formType: TransactionType.INCOME,
					},
				});
				break;
			}
			case TransactionType.EXPENSE: {
				// temp: open a dialog
				this.dialog.open(DataTableDialogComponent, {
					width: 'auto',
					data: {
						formType: TransactionType.EXPENSE,
					},
				});
				break;
			}
		}
	}

	async onDataChanged(): Promise<void> {
		await this.initialize();
	}
}
