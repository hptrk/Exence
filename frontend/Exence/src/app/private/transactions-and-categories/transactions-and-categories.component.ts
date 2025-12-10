import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Category } from '../../data-model/modules/category/Category';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { ButtonComponent } from '../../shared/button/button.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { DisplaySizeService } from '../../shared/display-size.service';
import { CategoryService } from '../category.service';
import { CreateCategoryDialogComponent } from './create-category-dialog/create-category-dialog.component';
import { CreateTransactionDialogComponent, CreateTranslationDialogData } from './create-transaction-dialog/create-transaction-dialog.component';
import { TransactionService } from './transaction.service';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { RecurringTransactionsResponse } from '../../data-model/modules/transaction/RecurringTransactionsResponse';

@Component({
	selector: 'ex-transactions-and-categories',
	templateUrl: './transactions-and-categories.component.html',
	styleUrl: './transactions-and-categories.component.scss',
	imports: [
		CommonModule,
		MatDialogModule,
		MatTabsModule,
		MatIconModule,
		MatTooltipModule,
		DataTableComponent,
		ButtonComponent,
	],
})
export class TransactionsAndCategoriesComponent implements OnInit {
	private readonly transactionService = inject(TransactionService);
	private readonly categoryService = inject(CategoryService);
	private readonly dialog = inject(MatDialog);
	private readonly snackbarService = inject(SnackbarService);
	readonly display = inject(DisplaySizeService);

	transactions: PagedResponse<Transaction> = {} as PagedResponse<Transaction>;
	recurringTransactions: RecurringTransactionsResponse = {} as RecurringTransactionsResponse;
	categories: Category[] = [];

	selectedIndex = 0;

	transactionTypes = TransactionType;

	get canCreateTransaction(): boolean {
		return !!this.categories.length;
	}

	async ngOnInit(): Promise<void> {
		await this.initialize();
	}

	async initialize(): Promise<void> {
		return Promise.all([
			this.getTransactions(),
			this.getRecurringTransactions(),
			this.getCategories(),
		]).then(([transactions, recurringTransactions, categories]) => {
			this.transactions = transactions;
			this.recurringTransactions = recurringTransactions;
			this.categories = categories;
		});
	}

	public openCreateTransactionDialog(): void {
		this.dialog.open<CreateTransactionDialogComponent, CreateTranslationDialogData, Transaction>(
			CreateTransactionDialogComponent, undefined
		).afterClosed().subscribe(
			async (newTransaction?: Transaction) => {
				if (newTransaction) {
					this.transactions = (await this.getTransactions());
					this.snackbarService.showSuccess(`Transaction '${newTransaction.title.slice(0, 10)}${newTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
				}
			}
		);
	}

	public openCreateCategoryDialog(): void {
		this.dialog.open<CreateCategoryDialogComponent, undefined, Category>(
			CreateCategoryDialogComponent, undefined
		).afterClosed().subscribe(
			async (newCategory?: Category) => {
				if (newCategory) {
					this.categories = (await this.getCategories());
					this.snackbarService.showSuccess(`Category '${newCategory.emoji}' created successfully!`);
				}
			}
		);
	}

	async onDataChanged(): Promise<void> {
		await this.initialize();
	}

	private getTransactions(): Promise<PagedResponse<Transaction>> {
		return this.transactionService.list();
	}

	private getRecurringTransactions(): Promise<RecurringTransactionsResponse> {
		return this.transactionService.listRecurrings();
	}

	private getCategories(): Promise<Category[]> {
		return this.categoryService.list();
	}
}
