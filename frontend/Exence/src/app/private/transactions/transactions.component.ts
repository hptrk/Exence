import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Category } from '../../data-model/modules/category/Category';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { ButtonComponent } from '../../shared/button/button.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { DisplaySizeService } from '../../shared/display-size.service';
import { CategoryService } from '../category.service';
import { CreateTransactionDialogComponent, CreateTranslationDialogData } from './create-transaction-dialog/create-transaction-dialog.component';
import { TransactionService } from './transaction.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
	selector: 'ex-transactions',
	templateUrl: './transactions.component.html',
	styleUrl: './transactions.component.scss',
	imports: [CommonModule, DataTableComponent, MatDialogModule, ButtonComponent ],
})
export class TransactionsComponent implements OnInit {
	private readonly transactionService = inject(TransactionService);
	private readonly categoryService = inject(CategoryService);
	private readonly dialog = inject(MatDialog);
	readonly display = inject(DisplaySizeService);

	transactions: Transaction[] = [];
	categories: Category[] = [];

	async ngOnInit(): Promise<void> {
		Promise.all([
			this.getTransactions(),
			this.getCategories(),
		]).then(([transactions, categories]) => {
			this.transactions = transactions.content;
			this.categories = categories;
		});
	}

	public openAddTransactionDialog(): void {
		const data: CreateTranslationDialogData = {
			categories: this.categories,
		};

		this.dialog.open<CreateTransactionDialogComponent, CreateTranslationDialogData, Transaction>(CreateTransactionDialogComponent, { data }).afterClosed().subscribe(async (newTransaction?: Transaction) => {
			if (newTransaction) {
				// TODO success snackbar
				this.transactions = (await this.getTransactions()).content;
			}
		});
	}

	private getTransactions(): Promise<PagedResponse<Transaction>> {
		return this.transactionService.list();
	}

	private getCategories(): Promise<Category[]> {
		return this.categoryService.list();
	}
}
