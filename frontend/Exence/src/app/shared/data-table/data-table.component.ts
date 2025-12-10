import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Category } from '../../data-model/modules/category/Category';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionModel } from '../../data-model/modules/transaction/TransactionModel';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CreateCategoryDialogComponent } from '../../private/transactions-and-categories/create-category-dialog/create-category-dialog.component';
import { CreateTransactionDialogComponent, CreateTransactionDialogData } from '../../private/transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { TransactionService } from '../../private/transactions-and-categories/transaction.service';
import { BaseComponent } from '../base-component/base.component';
import { ButtonComponent } from '../button/button.component';
import { DisplaySizeService } from '../display-size.service';
import { SvgIcons } from '../svg-icons/svg-icons';
import { SnackbarService } from '../snackbar/snackbar.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../private/category.service';
import { ValidatorComponent } from '../validator/validator.component';

export interface DataTableModel {
	transactions?: PagedResponse<Transaction>;
	categories: Category[];
}

@Component({
	selector: 'ex-data-table',
	imports: [
		MatCardModule,
		MatTableModule,
		MatIconModule,
		MatButtonModule,
		CommonModule,
		MatTooltipModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatPaginatorModule,
		MatMenuModule,
		MatCheckboxModule,
		MatSelectModule,
		ButtonComponent,
		ValidatorComponent,
	],
	templateUrl: './data-table.component.html',
	styleUrl: './data-table.component.scss',
	animations: [
		trigger('expandAnimation', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('collapsed => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
			transition('expanded => collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class DataTableComponent extends BaseComponent {
	private readonly snackbarService = inject(SnackbarService);
	private readonly transactionService = inject(TransactionService);
	private readonly categoryService = inject(CategoryService);
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly dialog = inject(MatDialog);
	readonly display = inject(DisplaySizeService);
	
	noteForm!: FormGroup;
	recurringForm!: FormGroup;
	categoryForm!: FormGroup;

	data = input.required<DataTableModel>();
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();
	title = input<string>();
	type = input<TransactionType | 'category'>();
	isRecurring = input<boolean | undefined>();
	nonExpandable = input(false, { transform: booleanAttribute });
	paginationDisabled = input(false, { transform: booleanAttribute });
	
	dataChangedEvent = output<void>();

	displayedColumns = ['title', 'date', 'amount', 'category', 'actions'];
	displayedCategoryColumns = ['name', 'emoji', 'actions'];

	expandedElement: Transaction | null = null;

	transactionTypes = TransactionType;

	transactionDataSource?: MatTableDataSource<TransactionModel>;
	categoryDataSource?: MatTableDataSource<Category>;
	pageSize?: number;
	pageIndex?: number;
	pageLength?: number;
	pageSizeOptions = [5, 10, 25, 100];

	// TODO
	// currentlyEditedRow = signal<number | undefined>(undefined);

	get emptyTransactionTable(): boolean {
		return !this.transactionDataSource?.data?.length;
	}

	get emptyCategoryTable(): boolean {
		return !this.categoryDataSource?.data?.length;
	}
	
	get emptyTableData(): boolean {
		return this.emptyTransactionTable && this.emptyCategoryTable;
	}
	
	constructor() {
		super();

		effect(() => {
			this.displayedColumns = this.display.isMd()
				? ['title', 'date', 'amount', 'category', 'actions']
				: ['title', 'date', 'amount', 'category'];
		});

		effect(() => {
			const data = this.data();

			const categories = data.categories;
			if (!data.transactions?.content) {
				this.categoryDataSource = new MatTableDataSource(categories)
				return;
			}
			const transactions = data.transactions.content
				.map(transaction => this.mapToTransactionModel(transaction, categories!));
				this.transactionDataSource = new MatTableDataSource(transactions);
			this.pageSize = data.transactions.size;
			this.pageIndex = data.transactions.page;
			this.pageLength = data.transactions.totalPages;

			let noteControls = {};
			let recurringControls = {};
			let categoryControls = {};
			data.transactions.content.forEach(transaction => {
				noteControls = {
					...noteControls,
					[transaction.id as number]: this.fb.control<string>(transaction.note ?? '', [Validators.maxLength(500)]),
				};
				recurringControls = {
					...recurringControls,
					[transaction.id as number]: this.fb.control<boolean>(transaction.recurring, [Validators.required]),
				};
				categoryControls = {
					...categoryControls,
					[transaction.id as number]: this.fb.control<number>(transaction.categoryId, [Validators.required]),
				};
			});
			this.noteForm = this.fb.group(noteControls);
			this.recurringForm = this.fb.group(recurringControls);
			this.categoryForm = this.fb.group(categoryControls);
		});
	}

	// editRow(rowId: number): void {
	// 	this.currentlyEditedRow.set(rowId);
	// }

	async deleteRow(rowId: number): Promise<void> {
		await this.transactionService.delete(rowId);
		this.snackbarService.showSuccess('Transaction deleted successfully!');
		this.dataChangedEvent.emit();
	}

	async deleteCategoryRow(rowId: number): Promise<void> {
		await this.categoryService.delete(rowId);
		this.snackbarService.showSuccess('Category deleted successfully!');
		this.dataChangedEvent.emit();
	}

	async saveRow(row: Transaction): Promise<void> {
		const newNoteValue = this.noteForm.controls[row.id!].getRawValue();
		const newRecurringValue = this.recurringForm.controls[row.id!].getRawValue();
		const newCategoryValue = this.categoryForm.controls[row.id!].getRawValue();

		const request: Transaction = {
			id: row.id,
			title: row.title,
			date: row.date,
			amount: row.amount,
			type: row.type,
			note: newNoteValue,
			recurring: newRecurringValue,
			categoryId: newCategoryValue,
		};
		const updatedTransaction = await this.transactionService.update(request);
		this.snackbarService.showSuccess(`Transaction '${updatedTransaction.title.slice(0, 10)}${updatedTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
		this.dataChangedEvent.emit();
	}

	cancelRowEdit(rowId: number): void {
		this.noteForm.controls[rowId].reset();
		this.recurringForm.controls[rowId].reset();
		this.categoryForm.controls[rowId].reset();
	}

	saveNoteDisabled(rowId: number): boolean {
		return (!this.noteForm.controls[rowId].touched
			&& !this.recurringForm.controls[rowId].touched
			&& !this.categoryForm.controls[rowId].touched
		) || this.noteForm.controls[rowId].invalid
			|| this.recurringForm.controls[rowId].invalid
			|| this.categoryForm.controls[rowId].invalid;
	}

	// isRowEditing(rowId: number): boolean {
	// 	return this.currentlyEditedRow() === rowId;
	// }

	toggleExpand(row: Transaction | null): void {
		if (this.nonExpandable() || !row) return;
		this.expandedElement = this.expandedElement === row ? null : row;
		// if (row.id === this.currentlyEditedRow()) {
		// 	this.currentlyEditedRow.set(undefined);
		// }
	}

	// TODO refactor
	openCreateDialog(): void {
		// All transactions
		if (!this.type()) {
			const data: CreateTransactionDialogData= { isRecurring: this.isRecurring() ?? false };
			this.dialog.open<CreateTransactionDialogComponent, CreateTransactionDialogData, Transaction>(
				CreateTransactionDialogComponent, { data }
			).afterClosed().subscribe(
				async (newTransaction) => {
					if (newTransaction) {
						this.dataChangedEvent.emit();
						this.snackbarService.showSuccess(`Transaction '${newTransaction.title.slice(0, 10)}${newTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
					}
				}
			)
		// Income or expense
		} else if (this.type() === TransactionType.EXPENSE || this.type() === TransactionType.INCOME) {
			const data = { isRecurring: this.isRecurring() ?? false, type: this.type()! as TransactionType };

			this.dialog.open<CreateTransactionDialogComponent, CreateTransactionDialogData, Transaction>(
				CreateTransactionDialogComponent, { data }
			).afterClosed().subscribe(
				async (newTransaction) => {
					if (newTransaction) {
						this.dataChangedEvent.emit();
						this.snackbarService.showSuccess(`Transaction '${newTransaction.title.slice(0, 10)}${newTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
					}
				}
			);
		// Categories
		} else if (this.type() === 'category') {
			this.dialog.open<CreateCategoryDialogComponent, undefined, Category>(
				CreateCategoryDialogComponent, undefined
			).afterClosed().subscribe(
				async (newCategory) => {
					if (newCategory) {
						this.dataChangedEvent.emit();
						this.snackbarService.showSuccess(`Category '${newCategory.emoji}' created successfully!`);
					}
				}
			);
		}
	}

	private mapToTransactionModel(transaction: Transaction, categories: Category[]): TransactionModel {
		const category = categories.find(c => c.id === transaction.categoryId);
		return {
			...transaction,
			category: category!
		};
	}
}
