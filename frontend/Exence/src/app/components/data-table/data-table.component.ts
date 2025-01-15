import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Transaction } from '../../models/Transaction';
import { DataTableDialogComponent } from './data-table-dialog/data-table-dialog.component';

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
  selector: 'app-data-table',
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    CommonModule,
    MatPaginator,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  constructor(public dialog: MatDialog) {}
  @Input() icon!: string;
  @Input() label!: string;
  @Input() formType: 'income' | 'expense' = 'income';

  displayedColumns: string[] = ['title', 'date', 'amount', 'category'];
  dataSource = DUMMY_DATA;

  openDialog(): void {
    this.dialog.open(DataTableDialogComponent, {
      width: 'auto',
      data: { formType: this.formType },
    });
  }
}
