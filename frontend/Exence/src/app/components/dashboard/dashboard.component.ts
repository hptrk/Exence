import { Component } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { SummaryContainerComponent } from './summary-container/summary-container.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { Transaction } from '../../models/Transaction';

const DUMMY_DATA: Transaction[] = [
  {
    title: 'Pay',
    date: '2023-10-04',
    amount: 61230,
    emoji: '🍽️',
    recurring: false,
  },
  {
    title: 'Groceries',
    date: '2023-10-01',
    amount: -18900,
    emoji: '🛒',
    recurring: false,
  },
  {
    title: 'Netflix',
    date: '2023-10-02',
    amount: -3000,
    emoji: '🎬',
    recurring: true,
  },
  {
    title: 'Restaurant',
    date: '2023-10-03',
    amount: -8000,
    emoji: '🍽️',
    recurring: false,
  },
  {
    title: 'Pay',
    date: '2023-10-04',
    amount: 61230,
    emoji: '🍽️',
    recurring: false,
  },
  {
    title: 'Heating bill',
    date: '2023-10-04',
    amount: -21300,
    emoji: '🔥',
    recurring: false,
  },
];
@Component({
  selector: 'app-dashboard',
  imports: [SummaryContainerComponent, DataTableComponent, ChartComponent],
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
