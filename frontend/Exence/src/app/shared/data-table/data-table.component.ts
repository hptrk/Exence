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
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Category } from '../../data-model/modules/category/Category';
import { CategoryType } from '../../data-model/modules/category/CategoryType';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionModel } from '../../data-model/modules/transaction/TransactionModel';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CategoryStore } from '../../private/transactions-and-categories/category.store';
import { CreateCategoryDialogComponent } from '../../private/transactions-and-categories/create-category-dialog/create-category-dialog.component';
import { CreateTransactionDialogComponent } from '../../private/transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { EditTransactionDialogComponent } from '../../private/transactions-and-categories/edit-transaction-dialog/edit-transaction-dialog.component';
import { TransactionStore } from '../../private/transactions-and-categories/transaction.store';
import { AnimatedSkeletonLoaderComponent } from '../animated-skeleton-loader/animated-skeleton-loader.component';
import { BaseComponent } from '../base-component/base.component';
import { ButtonComponent } from '../button/button.component';
import { DialogService } from '../dialog/dialog.service';
import { DisplaySizeService } from '../display-size.service';
import { TranslationCode } from '../i18n/translation-types';
import { CurrencyPipe } from '../pipes/currency.pipe';
import { TranslatePipe } from '../pipes/translate.pipe';
import { StopPropagationDirective } from '../stop-propagation.directive';
import { SvgIcons } from '../svg-icons/svg-icons';
import { DataTableDetailsComponent } from './data-table-details/data-table-details.component';

@Component({
	selector: 'ex-data-table',
	templateUrl: './data-table.component.html',
	styleUrl: './data-table.component.scss',
	imports: [
		MatCardModule,
		MatTableModule,
		MatIconModule,
		CommonModule,
		MatTooltipModule,
		MatMenuModule,
		ButtonComponent,
		AnimatedSkeletonLoaderComponent,
		DataTableDetailsComponent,
		StopPropagationDirective,
		InfiniteScrollDirective,
		TranslatePipe,
		CurrencyPipe,
	],
	// TODO remove deprecated angular animations
	/* eslint-disable */
	host: {
		'[class.is-category]': "type() === 'category'",
	},
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
	private readonly dialog = inject(DialogService);
	private readonly transactionStore = inject(TransactionStore);
	readonly display = inject(DisplaySizeService);
	readonly categoryStore = inject(CategoryStore);

	private scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');

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

	expandedRowId: number | null = null;

	readonly transactionTypes = TransactionType;

	transactionDataSource: WritableSignal<MatTableDataSource<TransactionModel>> = signal(
		new MatTableDataSource<TransactionModel>(),
	);
	categoryDataSource?: MatTableDataSource<Category>;
	pageSize?: number;
	pageIndex = 0;
	pageLength?: number;
	pageSizeOptions = [5, 10, 25, 100];

	emptyTransactionTable = computed(() => {
		const transactions = this.transactions();
		return (
			!transactions?.content?.length ||
			(!this.transactionDataSource()?.data.length &&
				!this.transactionStore.transactions.content?.length &&
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
		});
	}

	async editRow(row: TransactionModel): Promise<void> {
		const result = await this.dialog.openNonModal(EditTransactionDialogComponent, {
			transaction: row,
		});
		if (!result) return;
		this.transactionStore.updateTransaction(result);
	}

	deleteRow(transaciton: Transaction): void {
		this.transactionStore.deleteTransaction(transaciton);
	}

	deleteCategoryRow(id: number): void {
		this.categoryStore.deleteCategory(id);
	}

	toggleExpand(row: Transaction | null): void {
		if (this.nonExpandable() || !row) return;
		this.expandedRowId = this.expandedRowId === row.id ? null : row.id!;
	}

	async openCreateDialog(): Promise<void> {
		// All transactions
		let result;
		if (!this.type()) {
			result = await this.dialog.openNonModal(CreateTransactionDialogComponent, {
				isRecurring: this.isRecurring() ?? false,
			});
			// Income or expense
		} else if (this.type() === TransactionType.EXPENSE || this.type() === TransactionType.INCOME) {
			result = await this.dialog.openNonModal(CreateTransactionDialogComponent, {
				isRecurring: this.isRecurring() ?? false,
				type: this.type()! as TransactionType,
			});
			// Categories
		} else if (this.type() === 'category') {
			result = await this.dialog.openNonModal(CreateCategoryDialogComponent, undefined);
		}

		if (!result) return;
		if (this.type() === 'category') this.categoryStore.createCategory(result as Category);
		else this.transactionStore.createTransaction(result as Transaction);
	}

	getNextPage(): number {
		this.pageIndex++;
		return this.pageIndex;
	}

	codeForCategoryType(type: CategoryType): TranslationCode {
		return `categoryType.${type}`;
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
