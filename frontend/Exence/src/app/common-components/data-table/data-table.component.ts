import { Component, inject, input, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDialogComponent } from './data-table-dialog/data-table-dialog.component';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';

@Component({
	selector: 'ex-data-table',
	imports: [MatCardModule, MatTableModule, MatIconModule, CommonModule, MatPaginator],
	templateUrl: './data-table.component.html',
	styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
	private dialog = inject(MatDialog);
	private transactionService = inject(TransactionService);
	private categoryService = inject(CategoryService);

	icon = input.required<string>();
	label = input.required<string>();
	formType = input<'income' | 'expense'>('income');

	public displayedColumns = ['title', 'date', 'amount', 'category'];

	public categories = computed(() => this.categoryService.getCategories()());
	public filteredTransactions = computed(() =>
		this.transactionService
			.getTransactions()()
			.filter(transaction => transaction.type === this.formType()),
	);

	protected getCategoryEmoji(categoryId: number): string {
		const category = this.categories()?.find(category => category.id === categoryId);
		return category ? category.emoji : '';
	}

	protected openDialog(): void {
		this.dialog.open(DataTableDialogComponent, {
			width: 'auto',
			data: {
				formType: this.formType(),
			},
		});
	}

	protected openEditDialog(transaction: Transaction): void {
		this.dialog.open(DataTableDialogComponent, {
			width: 'auto',
			data: {
				formType: transaction.type,
				transaction,
			},
		});
	}

	protected changeCategory(transactionId: number, newCategoryId: number): void {
		this.transactionService.changeTransactionCategory(transactionId, newCategoryId).subscribe();
	}
}
