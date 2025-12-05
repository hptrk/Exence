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
import { TransactionService } from '../../private/transactions/transaction.service';
import { BaseComponent } from '../base-component/base.component';
import { DisplaySizeService } from '../display-size.service';
import { SvgIcons } from '../svg-icons/svg-icons';
import { DataTableDialogComponent } from './data-table-dialog/data-table-dialog.component';
import { TransactionModel } from '../../data-model/modules/transaction/TransactionModel';
import { Category } from '../../data-model/modules/category/Category';
// import { TransactionService } from '../../private/transactions/transaction.service';
// import { CategoryService } from '../../private/category.service';

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

	// TODO remove after category caching, preloading is done
	categories = input.required<Category[]>();

	data = input.required<Transaction[]>();
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();
	type = input<TransactionType>();
	nonExpandable = input(false, { transform: booleanAttribute });

	displayedColumns = ['title', 'date', 'amount', 'category', 'actions'];

	expandedElement: Transaction | null = null;

	transactionTypes = TransactionType;

	dataSource?: MatTableDataSource<TransactionModel>;

	constructor() {
		super();

		effect(() => {
			this.displayedColumns = this.display.isMd()
				? ['title', 'date', 'amount', 'category', 'actions']
				: ['title', 'date', 'amount', 'category'];
		});

		effect(() => {
			const transactionsInput = this.data();
			const categories = this.categories();
			const transactions = transactionsInput
				.map(transaction => this.mapToTransactionModel(transaction, categories));
				this.dataSource = new MatTableDataSource(transactions);
		});
	}

	mapToTransactionModel(transaction: Transaction, categories: Category[]): TransactionModel {
		const category = this.categories().find(c => c.id === transaction.categoryId);
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
				formType: this.type ?? undefined,
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
