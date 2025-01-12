import { Component, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ExpenseIncomeFormComponent } from '../../expense-income-form/expense-income-form.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-data-table-dialog',
  imports: [MatDialogModule, ExpenseIncomeFormComponent, MatIcon],
  templateUrl: './data-table-dialog.component.html',
  styleUrl: './data-table-dialog.component.scss',
})
export class DataTableDialogComponent {
  @Input() formType: 'income' | 'expense' = 'income';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.formType = data.formType;
  }
}
