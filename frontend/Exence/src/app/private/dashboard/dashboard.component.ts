import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { SummaryContainerComponent } from '../../private/dashboard/summary-container/summary-container.component';
import { ChartComponent } from '../../shared/chart/chart.component';
import { CategoriesComponent } from '../../private/dashboard/categories/categories.component';
import { ViewToggleComponent } from '../../shared/view-toggle/view-toggle.component';
import { AuthService } from '../../shared/account/auth.service';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { Category } from '../../data-model/modules/category/Category';
import { DisplaySizeService } from '../../shared/display-size.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatButton } from "@angular/material/button";
import { MatDialog } from '@angular/material/dialog';
import { DataTableDialogComponent } from '../../shared/data-table/data-table-dialog/data-table-dialog.component';

enum TransactionType {
	INCOME = 'INCOME',
	EXPENSE = 'EXPENSE'
} 

@Component({
	selector: 'ex-dashboard',
	imports: [SummaryContainerComponent, DataTableComponent, ChartComponent, CategoriesComponent, ViewToggleComponent, AsyncPipe, CommonModule, MatButton],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
	// private transactionService = inject(TransactionService);
	// private categoryService = inject(CategoryService);
	private authService = inject(AuthService);
	public display = inject(DisplaySizeService);
	public dialog = inject(MatDialog);

	// public transactions = this.transactionService.getTransactions();
	public transactions = computed(() => []);
	// public categories = this.categoryService.getCategories();
	public categories = computed(() => [{id: 1, name: 'Utilities', emoji: '👎'}, {id: 1, name: 'Utilities', emoji: '👎'}]);
	public username!: Signal<string>;
	public expenses!: Signal<Transaction[]>;
	public incomes!: Signal<Transaction[]>;
	public totalIncome!: Signal<number>;
	public totalExpenses!: Signal<number>;
	public balance!: Signal<number>;
	public highestSpendingCategory!: Signal<{ name: string; amount: number }>;

	transactionTypes = TransactionType;

	ngOnInit() {
		this.username = computed(() => this.authService.getUserData()()?.username ?? '');
		this.expenses = computed(() => []);
		this.incomes = computed(() => []);
		this.totalIncome = computed(() => this.incomes().reduce((sum, t) => sum + t.amount, 0));
		this.totalExpenses = computed(() => this.expenses().reduce((sum, t) => sum + t.amount, 0) * -1);
		this.balance = computed(() => this.totalIncome() + this.totalExpenses());
		this.highestSpendingCategory = computed(() => {
			const categorySpending: Record<number, number> = {};

			this.expenses().forEach(transaction => {
				categorySpending[transaction.categoryId] =
					(categorySpending[transaction.categoryId] || 0) + transaction.amount;
			});

			let highestId: number | null = null;
			let highestAmount = 0;

			Object.entries(categorySpending).forEach(([categoryId, amount]) => {
				if (amount > highestAmount) {
					highestAmount = amount;
					highestId = +categoryId;
				}
			});

			if (highestId === null) {
				return { name: '', amount: 0 };
			}

			// const category = this.categories().find(c => c.id === highestId);
			const category = { id: 1, name: 'dummyname', emoji: '💀'} as Category;
			return {
				name: category?.name ?? '',
				amount: highestAmount * -1,
			};
		});
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
}
