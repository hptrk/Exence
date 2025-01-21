import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDialogComponent } from './data-table-dialog/data-table-dialog.component';
import { Transaction } from '../../models/Transaction';
import { TransactionService } from '../../services/transaction.service';

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
  @Input() icon!: string;
  @Input() label!: string;
  @Input() formType: 'income' | 'expense' = 'income';
  @Input() transactions: Transaction[] = [];

  displayedColumns: string[] = ['title', 'date', 'amount', 'category'];
  dataSource: Transaction[] = [];

  constructor(
    public dialog: MatDialog,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {}

  openDialog(): void {
    this.dialog.open(DataTableDialogComponent, {
      width: 'auto',
      data: { formType: this.formType },
    });
  }
  openEditDialog(transaction: Transaction): void {
    this.formType = transaction.amount > 0 ? 'income' : 'expense';
    this.dialog.open(DataTableDialogComponent, {
      width: 'auto',
      data: { formType: this.formType, transaction },
    });
  }

  changeCategory(transactionId: number, newCategoryId: number): void {
    this.transactionService
      .changeTransactionCategory(transactionId, newCategoryId)
      .subscribe((updatedTransaction: Transaction) => {
        // Update the local transactions with the updated transaction
        const index = this.transactions.findIndex(
          (t) => t.id === transactionId
        );
        if (index !== -1) {
          this.dataSource[index] = updatedTransaction;
        }
      });
  }
}
