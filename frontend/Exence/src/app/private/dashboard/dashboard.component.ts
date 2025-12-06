import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Category } from '../../data-model/modules/category/Category';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CategoriesComponent, DateInterval } from '../../private/dashboard/categories/categories.component';
import {
	SummaryContainerComponent,
	SummaryType,
} from '../../private/dashboard/summary-container/summary-container.component';
import { CardSliderDirective } from '../../shared/card-slider.directive';
import { ChartComponent } from '../../shared/chart/chart.component';
import { DataTableDialogComponent } from '../../shared/data-table/data-table-dialog/data-table-dialog.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { DisplaySizeService } from '../../shared/display-size.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { ViewToggleComponent } from '../../shared/view-toggle/view-toggle.component';
import { CurrentUserService } from '../current-user.service';
import { User } from '../../data-model/modules/auth/User';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';

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

	transacrionTypes = TransactionType;
	summaryTypes = SummaryType;
	dateIntervals = DateInterval;

	user = computed(() => this.currentUserService.user());

	// private transactionService = inject(TransactionService);
	// private categoryService = inject(CategoryService);

	// public transactions = this.transactionService.getTransactions();
	public transactions = {} as PagedResponse<Transaction>;
	// public categories = this.categoryService.getCategories();
	public categories: Category[] = [];
	public expenses!: Signal<Transaction[]>;
	public incomes!: Signal<Transaction[]>;
	public totalIncome!: Signal<number>;
	public totalExpenses!: Signal<number>;
	public balance!: Signal<number>;
	public highestSpendingCategory!: Signal<{ name: string; amount: number }>;

	transactionTypes = TransactionType;

	ngOnInit() {
		this.expenses = computed(() => []);
		this.incomes = computed(() => []);
		this.totalIncome = computed(() => this.incomes().reduce((sum, t) => sum + t.amount, 0));
		this.totalExpenses = computed(() => this.expenses().reduce((sum, t) => sum + t.amount, 0) * -1);
		this.balance = computed(() => this.totalIncome() + this.totalExpenses());
		this.highestSpendingCategory = computed(() => {
			const categorySpending: Record<number, number> = {};

			this.expenses().forEach(transaction => {
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

			const category = { id: 1, name: 'dummyname', emoji: '💀' } as Category;
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
