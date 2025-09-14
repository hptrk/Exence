import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { SummaryContainerComponent } from '../../private/dashboard/summary-container/summary-container.component';
import { ChartComponent } from '../../shared/chart/chart.component';
import { CategoriesComponent } from '../../private/dashboard/categories/categories.component';
import { ViewToggleComponent } from '../../shared/view-toggle/view-toggle.component';
// import { TransactionService } from '../transactions/transaction.service';
// import { CategoryService } from '../category.service';
import { AuthService } from '../../shared/account/auth.service';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { Category } from '../../data-model/modules/category/Category';

@Component({
	selector: 'ex-dashboard',
	imports: [SummaryContainerComponent, DataTableComponent, ChartComponent, CategoriesComponent, ViewToggleComponent],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
	// private transactionService = inject(TransactionService);
	// private categoryService = inject(CategoryService);
	private authService = inject(AuthService);

	// public transactions = this.transactionService.getTransactions();
	public transactions = computed(() => []);
	// public categories = this.categoryService.getCategories();
	public categories = computed(() => []);
	public username!: Signal<string>;
	public expenses!: Signal<Transaction[]>;
	public incomes!: Signal<Transaction[]>;
	public totalIncome!: Signal<number>;
	public totalExpenses!: Signal<number>;
	public balance!: Signal<number>;
	public highestSpendingCategory!: Signal<{ name: string; amount: number }>;

	ngOnInit() {
		this.username = computed(() => this.authService.getUserData()()?.username ?? '');
		// this.expenses = computed(() => this.transactions().filter(t => t.type === 'expense'));
		this.expenses = computed(() => []);
		// this.incomes = computed(() => this.transactions().filter(t => t.type === 'income'));
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
}
