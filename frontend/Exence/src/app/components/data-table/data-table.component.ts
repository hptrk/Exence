import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDialogComponent } from './data-table-dialog/data-table-dialog.component';
import { Transaction } from '../../models/Transaction';
import { Category } from '../../models/Category';
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
  @Input() categories: Category[] = [];
  @Output() transactionAdded = new EventEmitter<void>();

  displayedColumns: string[] = ['title', 'date', 'amount', 'category'];
  filteredTransactions: Transaction[] = [];

  constructor(
    public dialog: MatDialog,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.filteredTransactions = this.transactions.filter(
      (transaction) => transaction.type === this.formType
    );
  }

  getCategoryEmoji(categoryId: number): string {
    const category = this.categories.find(
      (category) => category.id === categoryId
    );
    return category ? category.emoji : '';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DataTableDialogComponent, {
      width: 'auto',
      data: { formType: this.formType, categories: this.categories },
    });

    dialogRef.componentInstance.transactionAdded.subscribe(() => {
      this.transactionAdded.emit(); // Emit the event to notify the DashboardComponent
    });
  }
  openEditDialog(transaction: Transaction): void {
    this.formType = transaction.type as 'income' | 'expense';
    const dialogRef = this.dialog.open(DataTableDialogComponent, {
      width: 'auto',
      data: { formType: this.formType, transaction },
    });

    dialogRef.componentInstance.transactionAdded.subscribe(() => {
      this.transactionAdded.emit(); // Emit the event to notify the DashboardComponent
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
          this.transactions[index] = updatedTransaction;
          this.filteredTransactions = this.transactions.filter(
            (transaction) => transaction.type === this.formType
          );
        }
      });
  }
}
