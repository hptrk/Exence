import { Component } from '@angular/core';
import { ChartComponent } from '../../chart/chart.component';
import { SummaryContainerComponent } from './summary-container/summary-container.component';
import { DataTableComponent } from '../../data-table/data-table.component';
import { CategoriesComponent } from './categories/categories.component';
import { ViewToggleComponent } from '../../view-toggle/view-toggle.component';
import { Transaction } from '../../../models/Transaction';
import { TransactionService } from '../../../services/transaction.service';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';

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
  categories: Category[] = [];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.isLoading = false; // Remove this line after API integration
    this.transactionService
      .getTransactionsForLoggedInUser()
      .subscribe((transactions) => {
        this.transactions = transactions;
        this.isLoading = false;
      });

    this.categoryService
      .getCategoriesForLoggedInUser()
      .subscribe((categories) => {
        this.categories = categories;
      });
  }
}
