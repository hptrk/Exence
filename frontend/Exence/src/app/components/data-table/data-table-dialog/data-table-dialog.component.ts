import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ExpenseIncomeFormComponent } from '../../expense-income-form/expense-income-form.component';
import { MatIcon } from '@angular/material/icon';
import { Transaction } from '../../../models/Transaction';
import { Category } from '../../../models/Category';

@Component({
  selector: 'app-data-table-dialog',
  imports: [MatDialogModule, ExpenseIncomeFormComponent, MatIcon],
  templateUrl: './data-table-dialog.component.html',
  styleUrl: './data-table-dialog.component.scss',
})
export class DataTableDialogComponent {
  @Output() transactionAdded = new EventEmitter<void>();
  @Input() formType: 'income' | 'expense' = 'income';
  categories: Category[] = [];
  transaction: Transaction;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.formType = data.formType;
    this.transaction = data.transaction;
    this.categories = data.categories;
  }

  onTransactionAdded() {
    this.transactionAdded.emit();
  }
}
