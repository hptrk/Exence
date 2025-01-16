import { Component } from '@angular/core';
import { ChartComponent } from '../../chart/chart.component';
import { SummaryContainerComponent } from './summary-container/summary-container.component';
import { DataTableComponent } from '../../data-table/data-table.component';
import { Transaction } from '../../../models/Transaction';
import { CategoriesComponent } from './categories/categories.component';
import { ViewToggleComponent } from '../../view-toggle/view-toggle.component';

const DUMMY_DATA: Transaction[] = [
  {
    title: 'Pay',
    date: '2023-10-04',
    amount: 61230,
    emoji: '🍽️',
    recurring: false,
    category: 'Income',
  },
  {
    title: 'Groceries',
    date: '2023-10-01',
    amount: -18900,
    emoji: '🛒',
    recurring: false,
    category: 'Food',
  },
  {
    title: 'Investment',
    date: '2023-10-01',
    amount: -15200,
    emoji: '😞',
    recurring: false,
    category: 'Tax',
  },
  {
    title: 'Netflix',
    date: '2023-10-02',
    amount: -3000,
    emoji: '🎬',
    recurring: true,
    category: 'Entertainment',
  },
  {
    title: 'Restaurant',
    date: '2023-10-03',
    amount: -8000,
    emoji: '🍽️',
    recurring: false,
    category: 'Food',
  },
  {
    title: 'Pay',
    date: '2023-10-04',
    amount: 61230,
    emoji: '🍽️',
    recurring: false,
    category: 'Income',
  },
  {
    title: 'Heating bill',
    date: '2023-10-04',
    amount: -21300,
    emoji: '🔥',
    recurring: false,
    category: 'Utilities',
  },
];
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
  transactions = DUMMY_DATA;

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    });
  }
}
