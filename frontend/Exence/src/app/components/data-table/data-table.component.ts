import { Component, inject, input, computed, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDialogComponent } from './data-table-dialog/data-table-dialog.component';
import { Transaction } from '../../models/Transaction';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';

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
  private readonly dialog = inject(MatDialog);
  private readonly transactionService = inject(TransactionService);
  private readonly categoryService = inject(CategoryService);

  icon = input.required<string>();
  label = input.required<string>();
  formType = input<'income' | 'expense'>('income');
  // transactionAdded = output<void>();

  protected readonly displayedColumns = ['title', 'date', 'amount', 'category'];

  protected readonly categories = computed(() =>
    this.categoryService.getCategories()()
  );
  protected readonly filteredTransactions = computed(() =>
    this.transactionService
      .getTransactions()()
      .filter((transaction) => transaction.type === this.formType())
  );

  protected getCategoryEmoji(categoryId: number): string {
    const category = this.categories()?.find(
      (category) => category.id === categoryId
    );
    return category ? category.emoji : '';
  }

  protected openDialog(): void {
    const dialogRef = this.dialog.open(DataTableDialogComponent, {
      width: 'auto',
      data: {
        formType: this.formType(),
        categories: this.categories(),
      },
    });

    // dialogRef.componentInstance.transactionAdded.subscribe(() => {
    //   this.transactionAdded.emit(); // Emit the event to notify the DashboardComponent to reload the data
    // });
  }

  protected openEditDialog(transaction: Transaction): void {
    const dialogRef = this.dialog.open(DataTableDialogComponent, {
      width: 'auto',
      data: {
        formType: transaction.type,
        transaction,
      },
    });

    // dialogRef.componentInstance.transactionAdded.subscribe(() => {
    //   this.transactionAdded.emit(); // Emit the event to notify the DashboardComponent to reload the data
    // });
  }

  protected changeCategory(transactionId: number, newCategoryId: number): void {
    this.transactionService
      .changeTransactionCategory(transactionId, newCategoryId)
      .subscribe();
  }
}
