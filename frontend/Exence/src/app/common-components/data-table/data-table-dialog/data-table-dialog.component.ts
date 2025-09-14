import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ExpenseIncomeFormComponent } from '../../expense-income-form/expense-income-form.component';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'ex-data-table-dialog',
	imports: [MatDialogModule, ExpenseIncomeFormComponent, MatIcon],
	templateUrl: './data-table-dialog.component.html',
	styleUrl: './data-table-dialog.component.scss',
})
export class DataTableDialogComponent {
	// dialogData will come from the parent component
	private dialogData = inject(MAT_DIALOG_DATA);
	public formType: 'income' | 'expense' = this.dialogData.formType;

	// will come from the parent component IF the user wants to EDIT a transaction (otherwise it will be null)
	public transaction = this.dialogData.transaction ? this.dialogData.transaction : null;
}
