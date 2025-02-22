import { Component, computed, inject, OnInit } from '@angular/core';
import { ChartComponent } from '../../chart/chart.component';
import { SummaryContainerComponent } from './summary-container/summary-container.component';
import { DataTableComponent } from '../../data-table/data-table.component';
import { CategoriesComponent } from './categories/categories.component';
import { ViewToggleComponent } from '../../view-toggle/view-toggle.component';
import { TransactionService } from '../../../services/transaction.service';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    SummaryContainerComponent,
    DataTableComponent,
    ChartComponent,
    CategoriesComponent,
    ViewToggleComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly transactionService = inject(TransactionService);
  private readonly categoryService = inject(CategoryService);
  private readonly authService = inject(AuthService);

  protected readonly transactions = this.transactionService.getTransactions();
  protected readonly categories = this.categoryService.getCategories();

  // Computed values
  protected readonly username = computed(
    () => this.authService.getUserData()()?.username ?? ''
  );

  protected readonly expenses = computed(() =>
    this.transactions().filter((t) => t.type === 'expense')
  );

  protected readonly incomes = computed(() =>
    this.transactions().filter((t) => t.type === 'income')
  );

  protected readonly totalIncome = computed(() =>
    this.incomes().reduce((sum, t) => sum + t.amount, 0)
  );

  protected readonly totalExpenses = computed(
    () => this.expenses().reduce((sum, t) => sum + t.amount, 0) * -1
  );

  protected readonly balance = computed(
    () => this.totalIncome() + this.totalExpenses()
  );

  protected readonly highestSpendingCategory = computed(() => {
    const categorySpending: { [key: number]: number } = {};

    this.expenses().forEach((transaction) => {
      categorySpending[transaction.categoryId] =
        (categorySpending[transaction.categoryId] || 0) + transaction.amount;
    });

    let highestId: any = null;
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

    const category = this.categories().find((c) => c.id === highestId);
    return {
      name: category?.name ?? '',
      amount: highestAmount * -1,
    };
  });
}
