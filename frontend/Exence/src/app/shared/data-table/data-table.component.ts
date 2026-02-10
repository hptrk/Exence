import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
	booleanAttribute,
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	input,
	output,
	signal,
	viewChild,
	WritableSignal,
} from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Category } from '../../data-model/modules/category/Category';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionModel } from '../../data-model/modules/transaction/TransactionModel';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CategoryStore } from '../../private/transactions-and-categories/category.store';
import { CreateCategoryDialogComponent } from '../../private/transactions-and-categories/create-category-dialog/create-category-dialog.component';
import { CreateTransactionDialogComponent } from '../../private/transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { TransactionStore } from '../../private/transactions-and-categories/transaction.store';
import { BaseComponent } from '../base-component/base.component';
import { ButtonComponent } from '../button/button.component';
import { DialogService } from '../dialog/dialog.service';
import { DisplaySizeService } from '../display-size.service';
import { StopPropagationDirective } from '../stop-propagation.directive';
import { SvgIcons } from '../svg-icons/svg-icons';
import { ValidatorComponent } from '../validator/validator.component';

@Component({
	selector: 'ex-data-table',
	templateUrl: './data-table.component.html',
	styleUrl: './data-table.component.scss',
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
		MatMenuModule,
		MatCheckboxModule,
		MatSelectModule,
		MatProgressSpinnerModule,
		ButtonComponent,
		ValidatorComponent,
		StopPropagationDirective,
		InfiniteScrollDirective,
	],
	// TODO remove deprecated angular animations
	/* eslint-disable */
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
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly dialog = inject(DialogService);
	private readonly transactionStore = inject(TransactionStore);
	readonly display = inject(DisplaySizeService);
	readonly categoryStore = inject(CategoryStore);

	private scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');

	noteForm!: FormGroup;
	recurringForm!: FormGroup;
	categoryForm!: FormGroup;

	transactions = input<PagedResponse<Transaction> | undefined>();
	isDataLoading = input<boolean | undefined>();
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();
	title = input<string>();
	type = input<TransactionType | 'category'>();
	isRecurring = input<boolean | undefined>();
	nonExpandable = input(false, { transform: booleanAttribute });

	dataChangedEvent = output<void>();
	onScroll = output<number>();

	displayedColumns = ['title', 'date', 'amount', 'category', 'actions'];
	displayedCategoryColumns = ['name', 'icon', 'type', 'actions'];

	expandedElement: Transaction | null = null;

	transactionTypes = TransactionType;

	transactionDataSource: WritableSignal<MatTableDataSource<TransactionModel>> = signal(
		new MatTableDataSource<TransactionModel>(),
	);
	categoryDataSource?: MatTableDataSource<Category>;
	pageSize?: number;
	pageIndex = 0;
	pageLength?: number;
	pageSizeOptions = [5, 10, 25, 100];

	// TODO
	// currentlyEditedRow = signal<number | undefined>(undefined);

	emptyTransactionTable = computed(() => {
		const transactions = this.transactions();
		return (
			!transactions?.content?.length ||
			(!this.transactionDataSource()?.data.length &&
				!this.transactionStore.data.transactions.content?.length &&
				!this.transactionStore.transactionResource.isLoading())
		);
	});

	emptyCategoryTable = computed(() => {
		const categories = this.categoryStore.categoryResource.value();
		return !categories?.length;
	});

	emptyTableData = computed(() => {
		const emptyTransactionTable = this.emptyTransactionTable();
		const emptyCategoryTable = this.emptyCategoryTable();
		const type = this.type();
		return emptyTransactionTable && (emptyCategoryTable || type !== 'category');
	});

	constructor() {
		super();

		effect(() => {
			this.displayedColumns = this.display.isMd()
				? ['title', 'date', 'amount', 'category', 'actions']
				: ['title', 'date', 'amount', 'category'];
		});

		effect(() => {
			const transactions = this.transactions();
			const categories = this.categoryStore.categoryResource.value();

			if (!categories?.length || !transactions?.content?.length) return;

			if (transactions.content.length <= 20) this.scrollToTop();

			const transactionDataSource = transactions.content.map(transaction =>
				this.mapToTransactionModel(transaction, this.categoryStore.categoryResource.value()!),
			);
			this.transactionDataSource?.set(new MatTableDataSource(transactionDataSource));
			this.pageSize = transactions.size;
			this.pageIndex = transactions.page;
			this.pageLength = transactions.totalPages;

			let noteControls = {};
			let recurringControls = {};
			let categoryControls = {};
			transactions.content.forEach(transaction => {
				noteControls = {
					...noteControls,
					[transaction.id!]: this.fb.control<string>(transaction.note ?? '', [Validators.maxLength(500)]),
				};
				recurringControls = {
					...recurringControls,
					[transaction.id!]: this.fb.control<boolean>(transaction.recurring, [Validators.required]),
				};
				categoryControls = {
					...categoryControls,
					[transaction.id!]: this.fb.control<number>(transaction.categoryId, [Validators.required]),
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

	deleteRow(transaciton: Transaction): void {
		this.transactionStore.deleteTransaction(transaciton);
	}

	deleteCategoryRow(id: number): void {
		this.categoryStore.deleteCategory(id);
	}

	saveRow(row: Transaction): void {
		if (!row.id) return;
		const newNoteValue = this.noteForm.controls[row.id].getRawValue();
		const newRecurringValue = this.recurringForm.controls[row.id].getRawValue();
		const newCategoryValue = this.categoryForm.controls[row.id].getRawValue();

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
		this.transactionStore.updateTransaction(request);
	}

	cancelRowEdit(rowId: number): void {
		this.noteForm.controls[rowId].reset();
		this.recurringForm.controls[rowId].reset();
		this.categoryForm.controls[rowId].reset();
	}

	saveNoteDisabled(rowId: number): boolean {
		return (
			(!this.noteForm.controls[rowId].touched &&
				!this.recurringForm.controls[rowId].touched &&
				!this.categoryForm.controls[rowId].touched) ||
			this.noteForm.controls[rowId].invalid ||
			this.recurringForm.controls[rowId].invalid ||
			this.categoryForm.controls[rowId].invalid
		);
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

	async openCreateDialog(): Promise<void> {
		// All transactions
		if (!this.type()) {
			await this.dialog.openNonModal(CreateTransactionDialogComponent, {
				isRecurring: this.isRecurring() ?? false,
			});
			// Income or expense
		} else if (this.type() === TransactionType.EXPENSE || this.type() === TransactionType.INCOME) {
			await this.dialog.openNonModal(CreateTransactionDialogComponent, {
				isRecurring: this.isRecurring() ?? false,
				type: this.type()! as TransactionType,
			});
			// Categories
		} else if (this.type() === 'category') {
			await this.dialog.openNonModal(CreateCategoryDialogComponent, undefined);
		}
	}

	getNextPage(): number {
		this.pageIndex++;
		return this.pageIndex;
	}

	private mapToTransactionModel(transaction: Transaction, categories: Category[]): TransactionModel {
		const category = categories.find(c => c.id === transaction.categoryId);
		return {
			...transaction,
			category: category!,
		};
	}

	private scrollToTop(): void {
		const container = this.scrollContainer()?.nativeElement;
		if (container) {
			container.scrollTop = 0;

			setTimeout(() => {
				container.scrollTop = 1;
			}, 0);
		}
	}
}
