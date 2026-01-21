import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Category } from '../../data-model/modules/category/Category';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { RecurringTransactionsResponse } from '../../data-model/modules/transaction/RecurringTransactionsResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { ButtonComponent } from '../../shared/button/button.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../shared/display-size.service';
import { CategoryService } from '../category.service';
import { CreateTransactionDialogComponent } from './create-transaction-dialog/create-transaction-dialog.component';
import { TransactionService } from './transaction.service';
import { CreateCategoryDialogComponent } from './create-category-dialog/create-category-dialog.component';

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
	private readonly dialog = inject(DialogService);
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
			this.transactionService.list(),
			this.transactionService.listRecurrings(),
			this.categoryService.list(),
		]).then(([transactions, recurringTransactions, categories]) => {
			this.transactions = transactions;
			this.recurringTransactions = recurringTransactions;
			this.categories = categories;
		});
	}

	public async openCreateTransactionDialog(): Promise<void> {
		const result = await this.dialog.openNonModal(CreateTransactionDialogComponent, undefined);
		if (!result) return;
		await this.initialize(); // to trigger data refresh in all tables (e.g. if a recurring transaction was created)
	}

	public async openCreateCategoryDialog(): Promise<void> {
		const result = await this.dialog.openNonModal(CreateCategoryDialogComponent, undefined);
		if (!result) return;
		this.categories = (await this.categoryService.list());
	}

	async onDataChanged(): Promise<void> {
		await this.initialize();
	}
}
