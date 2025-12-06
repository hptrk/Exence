import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, effect, inject, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { TransactionService } from '../../private/transactions-and-categories/transaction.service';
import { BaseComponent } from '../base-component/base.component';
import { DisplaySizeService } from '../display-size.service';
import { SvgIcons } from '../svg-icons/svg-icons';
import { DataTableDialogComponent } from './data-table-dialog/data-table-dialog.component';
import { TransactionModel } from '../../data-model/modules/transaction/TransactionModel';
import { Category } from '../../data-model/modules/category/Category';
import { MatPaginatorModule } from "@angular/material/paginator";
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';

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
		CommonModule,
		MatTooltipModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatPaginatorModule
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
	note = new FormControl();

	private dialog = inject(MatDialog);
	private transactionService = inject(TransactionService);
	public display = inject(DisplaySizeService);
	
	data = input.required<DataTableModel>();
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();
	title = input<string>();
	nonExpandable = input(false, { transform: booleanAttribute });
	paginationDisabled = input(false, { transform: booleanAttribute });

	displayedColumns = ['title', 'date', 'amount', 'category', 'actions'];
	displayedCategoryColumns = ['name', 'emoji'];


	expandedElement: Transaction | null = null;

	transactionTypes = TransactionType;

	transactionDataSource?: MatTableDataSource<TransactionModel>;
	categoryDataSource?: MatTableDataSource<Category>;
	pageSize?: number;
	pageIndex?: number;
	pageLength?: number;
	pageSizeOptions = [5, 10, 25, 100];

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
			console.log('transaction ', this.transactionDataSource.data)
			console.log('category ', this.categoryDataSource?.data)
		});
	}

	mapToTransactionModel(transaction: Transaction, categories: Category[]): TransactionModel {
		const category = categories.find(c => c.id === transaction.categoryId);
		return {
			...transaction,
			category: category!
		};
	}

	toggleExpand(row: Transaction | null): void {
		if (this.nonExpandable()) return;
		this.expandedElement = this.expandedElement === row ? null : row;
	}

	openDialog(): void {
		this.dialog.open(DataTableDialogComponent, {
			width: 'auto',
			data: {
				formType: this.transactionTypes.EXPENSE,
			},
		});
	}

	openEditDialog(transaction: Transaction): void {
		this.dialog.open(DataTableDialogComponent, {
			width: 'auto',
			data: {
				formType: transaction.type,
				transaction,
			},
		});
	}
}
