import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { MatButton } from "@angular/material/button";
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Category } from '../../data-model/modules/category/Category';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CategoriesComponent, DateInterval } from '../../private/dashboard/categories/categories.component';
import { SummaryContainerComponent, SummaryType } from '../../private/dashboard/summary-container/summary-container.component';
import { AuthService } from '../../shared/account/auth.service';
import { CardSliderDirective } from "../../shared/card-slider.directive";
import { ChartComponent } from '../../shared/chart/chart.component';
import { DataTableDialogComponent } from '../../shared/data-table/data-table-dialog/data-table-dialog.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { DisplaySizeService } from '../../shared/display-size.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { ViewToggleComponent } from '../../shared/view-toggle/view-toggle.component';

@Component({
	selector: 'ex-dashboard',
	imports: [SummaryContainerComponent, DataTableComponent, ChartComponent, CategoriesComponent, ViewToggleComponent, AsyncPipe, CommonModule, MatButton, CardSliderDirective, RouterModule],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
	private authService = inject(AuthService);
	public display = inject(DisplaySizeService);
	public dialog = inject(MatDialog);
	public router = inject(Router);
	public navigation = inject(NavigationService);

	transacrionTypes = TransactionType;	
	summaryTypes = SummaryType;
	dateIntervals = DateInterval;


	// private transactionService = inject(TransactionService);
	// private categoryService = inject(CategoryService);

	// public transactions = this.transactionService.getTransactions();
	public transactions = computed(() => []);
	// public categories = this.categoryService.getCategories();
	public categories = computed(() => [
		{id: 1, name: 'Travel', emoji: '✈️'},
		{id: 2, name: 'Groceries', emoji: '🥦'},
		{id: 3, name: 'Takeout', emoji: '🍕'},
		{id: 4, name: 'Housing', emoji: '🛖'},
		{id: 5, name: 'Fitness', emoji: '🚲'},
		{id: 6, name: 'Gifts', emoji: '🎁'},
	]);
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
		this.expenses = computed(() => [{
				id: 1,
				title: 'Taxi',
				date: new Date().toISOString(),
				amount: 30000,
				type: TransactionType.EXPENSE,
				recurring: false,
				category: { id: 1, name: 'Travel', emoji: '✈️' },
		}, {
				id: 2,
				title: 'Bérlet',
				date: new Date().toISOString(),
				amount: 2990,
				type: TransactionType.EXPENSE,
				recurring: true,
				category: { id: 1, name: 'Travel', emoji: '✈️' },
		}, {
				id: 3,
				title: 'lidl',
				date: new Date().toISOString(),
				amount: 36429,
				type: TransactionType.EXPENSE,
				recurring: false,
				category: {id: 2, name: 'Groceries', emoji: '🥦'},
		}, {
				id: 4,
				title: 'KFC',
				date: new Date().toISOString(),
				amount: 7690,
				type: TransactionType.EXPENSE,
				recurring: false,
				category: {id: 3, name: 'Takeout', emoji: '🍕'},
		}, {
				id: 5,
				title: 'Mosógép',
				date: new Date().toISOString(),
				amount: 249000,
				type: TransactionType.EXPENSE,
				recurring: false,
				category: {id: 4, name: 'Housing', emoji: '🛖'},
		}, {
				id: 6,
				title: 'Gym bérlet',
				date: new Date().toISOString(),
				amount: 21990,
				type: TransactionType.EXPENSE,
				recurring: true,
				category: {id: 5, name: 'Fitness', emoji: '🚲'},
		}, {
				id: 6,
				title: 'Karácsony',
				date: new Date().toISOString(),
				amount: 45000,
				type: TransactionType.EXPENSE,
				recurring: false,
				category: {id: 6, name: 'Gifts', emoji: '🎁'},
		}]);
		this.incomes = computed(() => []);
		this.totalIncome = computed(() => this.incomes().reduce((sum, t) => sum + t.amount, 0));
		this.totalExpenses = computed(() => this.expenses().reduce((sum, t) => sum + t.amount, 0) * -1);
		this.balance = computed(() => this.totalIncome() + this.totalExpenses());
		this.highestSpendingCategory = computed(() => {
			const categorySpending: Record<number, number> = {};

			this.expenses().forEach(transaction => {
				// categorySpending[transaction.categoryId] =
				// 	(categorySpending[transaction.categoryId] || 0) + transaction.amount;
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
