import { Component } from '@angular/core';
import { ChartComponent } from '../../chart/chart.component';
import { SummaryContainerComponent } from './summary-container/summary-container.component';
import { DataTableComponent } from '../../data-table/data-table.component';
import { CategoriesComponent } from './categories/categories.component';
import { ViewToggleComponent } from '../../view-toggle/view-toggle.component';
import { Transaction } from '../../../models/Transaction';
import { TransactionService } from '../../../services/transaction.service';
import { Category } from '../../../models/Category';
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
  isLoading = true;
  transactions: Transaction[] = [];
  expenses: Transaction[] = [];
  incomes: Transaction[] = [];
  categories: Category[] = [];
  user: any;
  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;
  highestSpendingCategory: { name: string; amount: number } = {
    name: '',
    amount: 0,
  };

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.transactionService
      .getTransactionsForLoggedInUser()
      .subscribe((transactions) => {
        this.transactions = transactions;
        this.expenses = transactions.filter(
          (transaction) => transaction.type === 'expense'
        );
        this.incomes = transactions.filter(
          (transaction) => transaction.type === 'income'
        );
        this.totalIncome = this.incomes.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );
        this.totalExpenses =
          this.expenses.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
          ) * -1;
        this.balance = this.totalIncome + this.totalExpenses;
        this.calculateHighestSpendingCategory();
        this.isLoading = false;
      });

    this.categoryService
      .getCategoriesForLoggedInUser()
      .subscribe((categories) => {
        this.categories = categories;
      });

    this.authService.getUserData().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Failed to fetch user data', error);
      }
    );
  }

  calculateHighestSpendingCategory() {
    const categorySpending: { [key: number]: number } = {};
    this.expenses.forEach((transaction) => {
      if (!categorySpending[transaction.categoryId]) {
        categorySpending[transaction.categoryId] = 0;
      }
      categorySpending[transaction.categoryId] += transaction.amount;
    });

    let highestSpendingCategoryId = null;
    let highestSpendingAmount = 0;
    for (const categoryId in categorySpending) {
      if (categorySpending[categoryId] > highestSpendingAmount) {
        highestSpendingAmount = categorySpending[categoryId];
        highestSpendingCategoryId = categoryId;
      }
    }

    if (highestSpendingCategoryId !== null) {
      const category = this.categories.find(
        (category) => category.id === +highestSpendingCategoryId
      );
      if (category) {
        this.highestSpendingCategory = {
          name: category.name,
          amount: highestSpendingAmount * -1,
        };
      }
    }
  }
  onTransactionAdded() {
    this.loadData();
  }
}
