import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Category } from '../../data-model/modules/category/Category';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { RecurringTransactionsResponse } from '../../data-model/modules/transaction/RecurringTransactionsResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { BaseComponent } from '../../shared/base-component/base.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { DisplaySizeService } from '../../shared/display-size.service';
import { FilterMenuComponent } from '../../shared/filter-menu/filter-menu.component';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { ValidatorComponent } from '../../shared/validator/validator.component';
import { CategoryService } from '../category.service';
import { CreateCategoryDialogComponent } from './create-category-dialog/create-category-dialog.component';
import { CreateTransactionDialogComponent, CreateTransactionDialogData } from './create-transaction-dialog/create-transaction-dialog.component';
import { TransactionService } from './transaction.service';
import { InputClearButtonComponent } from '../../shared/input-clear-button/input-clear-button.component';

@Component({
	selector: 'ex-transactions-and-categories',
	templateUrl: './transactions-and-categories.component.html',
	styleUrl: './transactions-and-categories.component.scss',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatDialogModule,
		MatTabsModule,
		MatIconModule,
		MatTooltipModule,
		MatInputModule,
		MatCheckboxModule,
		MatSelectModule,
		MatBadgeModule,
		MatDatepickerModule,
		MatLabel,
		MatError,
		DataTableComponent,
		ButtonComponent,
		FilterMenuComponent,
		ValidatorComponent,
		InputClearButtonComponent,
	],
})
export class TransactionsAndCategoriesComponent extends BaseComponent implements OnInit {
	private readonly transactionService = inject(TransactionService);
	private readonly categoryService = inject(CategoryService);
	private readonly dialog = inject(MatDialog);
	private readonly snackbarService = inject(SnackbarService);
	private readonly fb = inject(NonNullableFormBuilder);
	readonly display = inject(DisplaySizeService);

	transactionFilterForm = this.fb.group({
		searchText: this.fb.control<string>('', [Validators.maxLength(255)]),
		dateRange: this.fb.group({
			dateFrom: this.fb.control<Date | null>(null),
			dateTo: this.fb.control<Date | null>(null),
		}),
		amountRange: this.fb.group({
			min: this.fb.control<number | null>(null),
			max: this.fb.control<number | null>(null),
		}),
		category: this.fb.control<Category | null>(null),
		type: this.fb.control<TransactionType | null>(null),
		recurring: this.fb.control<boolean>(false),
	});

	transactions: PagedResponse<Transaction> = {} as PagedResponse<Transaction>;
	recurringTransactions: RecurringTransactionsResponse = {} as RecurringTransactionsResponse;
	categories: Category[] = [];

	selectedIndex = 0;

	transactionTypes = TransactionType;
	transactionTypesArr = Object.values(this.transactionTypes);

	get canCreateTransaction(): boolean { return !!this.categories.length; }

	get appliedFiltersCount(): number {
		return Object.entries(this.transactionFilterForm.controls).reduce((sum, [key, control]) => {
			if (key === 'dateRange' || key === 'amountRange') {
				const groupValue = control.value as Record<string, unknown>;
				const hasValue = Object.values(groupValue).some(v => !!v);
				return sum + (hasValue ? 1 : 0);
			}
			if (control.value) return sum + 1;
			return sum;
		}, 0);
	}

	async ngOnInit(): Promise<void> {
		await this.initialize();

		this.addSubscription(this.transactionFilterForm.valueChanges.subscribe(async () => {
			if (this.transactionFilterForm.invalid) return;
			this.transactions = await this.getTransactions();
		}));
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

	openCreateTransactionDialog(): void {
		this.dialog.open<CreateTransactionDialogComponent, CreateTransactionDialogData, Transaction>(
			CreateTransactionDialogComponent, undefined
		).afterClosed().subscribe(
			async (newTransaction?: Transaction) => {
				if (newTransaction) {
					await this.initialize(); // to trigger data refresh in all tables (e.g. if a recurring transaction was created)
					this.snackbarService.showSuccess(`Transaction '${newTransaction.title.slice(0, 10)}${newTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
				}
			}
		);
	}

	openCreateCategoryDialog(): void {
		this.dialog.open<CreateCategoryDialogComponent, undefined, Category>(
			CreateCategoryDialogComponent, undefined
		).afterClosed().subscribe(
			async (newCategory?: Category) => {
				if (newCategory) {
					this.categories = (await this.categoryService.list());
					this.snackbarService.showSuccess(`Category '${newCategory.emoji}' created successfully!`);
				}
			}
		);
	}

	async onDataChanged(): Promise<void> {
		await this.initialize();
	}

	getTransactions(): Promise<PagedResponse<Transaction>> {
		const formValue = this.transactionFilterForm.getRawValue();
		const filters = {
			keyword: formValue.searchText,
			dateFrom: formValue.dateRange.dateFrom?.toISOString(),
			dateTo: formValue.dateRange.dateTo?.toISOString(),
			categoryId: formValue.category?.id,
			type: formValue.type,
			amountFrom: formValue.amountRange.min,
			amountTo: formValue.amountRange.max,
			recurring: formValue.recurring,
		} as TransactionFilter;
		return this.transactionService.list(filters);
	}
}
