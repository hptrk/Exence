import { booleanAttribute, Component, effect, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRowDef, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDialogComponent } from './data-table-dialog/data-table-dialog.component';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { BaseComponent } from '../base-component/base.component';
import { MatIconModule } from '@angular/material/icon';
import { TransactionService } from '../../private/transactions/transaction.service';
import { SvgIcons } from '../svg-icons/svg-icons';
import { DisplaySizeService } from '../display-size.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';
// import { TransactionService } from '../../private/transactions/transaction.service';
// import { CategoryService } from '../../private/category.service';

@Component({
	selector: 'ex-data-table',
	imports: [MatCardModule, MatTableModule, MatIconModule, CommonModule, MatTooltipModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule],
	templateUrl: './data-table.component.html',
	styleUrl: './data-table.component.scss',
	animations: [
	trigger('expandAnimation', [
		state('collapsed', style({height: '0px', minHeight: '0'})),
		state('expanded', style({height: '*'})),
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

	data = input.required<Transaction[]>();
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();
	type = input<TransactionType>();
	nonExpandable = input(false, {transform: booleanAttribute });

	displayedColumns = ['title', 'date', 'amount', 'category', 'actions'];

	expandedElement: Transaction | null = null;

	transactionTypes = TransactionType;
	
	dataSource = new MatTableDataSource<Transaction>([
		{
			id: 1,
			title: 'lidl',
			date: new Date().toISOString(),
			amount: 17600,
			type: TransactionType.EXPENSE,
			recurring: false,
			category: {
				id: 1,
				name: 'Groceries',
				emoji: '🥦'
			}
		},
		{
			id: 2,
			title: 'Work Payment',
			date: new Date().toISOString(),
			amount: 1260000,
			type: TransactionType.INCOME,
			recurring: true,
			category: {
				id: 1,
				name: 'Test category',
				emoji: '🥦'
			}
		},
		{
			id: 2,
			title: 'Rent',
			date: new Date().toISOString(),
			amount: -150000,
			type: TransactionType.EXPENSE,
			recurring: true,
			category: {
				id: 1,
				name: 'Test category',
				emoji: '🛖'
			}
		},
		{
			id: 1,
			title: 'lidl',
			date: new Date().toISOString(),
			amount: 17600,
			type: TransactionType.EXPENSE,
			recurring: false,
			category: {
				id: 1,
				name: 'Groceries',
				emoji: '🥦'
			}
		},
		{
			id: 2,
			title: 'Work Payment for doing really nothing in the world',
			date: new Date().toISOString(),
			amount: 1260000,
			type: TransactionType.INCOME,
			recurring: true,
			category: {
				id: 1,
				name: 'Test category',
				emoji: '🥦'
			}
		},
		{
			id: 2,
			title: 'Rent',
			date: new Date().toISOString(),
			amount: -150000,
			type: TransactionType.EXPENSE,
			recurring: true,
			category: {
				id: 1,
				name: 'Test category',
				emoji: '🛖'
			}
		},
		{
			id: 1,
			title: 'lidl',
			date: new Date().toISOString(),
			amount: 17600,
			type: TransactionType.EXPENSE,
			recurring: false,
			category: {
				id: 1,
				name: 'Groceries',
				emoji: '🥦'
			}
		},
		{
			id: 2,
			title: 'Work Payment',
			date: new Date().toISOString(),
			amount: 1260000,
			type: TransactionType.INCOME,
			recurring: true,
			category: {
				id: 1,
				name: 'Test category',
				emoji: '🥦'
			}
		},
		{
			id: 2,
			title: 'Rent',
			date: new Date().toISOString(),
			amount: -150000,
			type: TransactionType.EXPENSE,
			recurring: true,
			category: {
				id: 1,
				name: 'Test category',
				emoji: '🛖'
			}
		},
		{
			id: 1,
			title: 'lidl',
			date: new Date().toISOString(),
			amount: 17600,
			type: TransactionType.EXPENSE,
			recurring: false,
			category: {
				id: 1,
				name: 'Groceries',
				emoji: '🥦'
			}
		},
		{
			id: 2,
			title: 'Work Payment',
			date: new Date().toISOString(),
			amount: 1260000,
			type: TransactionType.INCOME,
			recurring: true,
			category: {
				id: 1,
				name: 'Test category',
				emoji: '🥦'
			}
		},
		{
			id: 2,
			title: 'Rent',
			date: new Date().toISOString(),
			amount: -150000,
			type: TransactionType.EXPENSE,
			recurring: true,
			category: {
				id: 1,
				name: 'Test category',
				emoji: '🛖'
			}
		},
		{
			id: 1,
			title: 'lidl',
			date: new Date().toISOString(),
			amount: 17600,
			type: TransactionType.EXPENSE,
			recurring: false,
			category: {
				id: 1,
				name: 'Groceries',
				emoji: '🥦'
			}
		},
		{
			id: 2,
			title: 'Work Payment',
			date: new Date().toISOString(),
			amount: 1260000,
			type: TransactionType.INCOME,
			recurring: true,
			category: {
				id: 1,
				name: 'Test category',
				emoji: '🥦'
			}
		},
		{
			id: 2,
			title: 'Rent',
			date: new Date().toISOString(),
			amount: -150000,
			type: TransactionType.EXPENSE,
			recurring: true,
			category: {
				id: 1,
				name: 'Test category',
				emoji: '🛖'
			}
		},
	]);
	
	constructor() {
		super();

		effect(() => {
			this.displayedColumns = this.display.isMd()
				? ['title', 'date', 'amount', 'category', 'actions']
				: ['title', 'date', 'amount', 'category'];
		});
	}

	toggleExpand(row: Transaction | null): void {
		if (this.nonExpandable()) return;
		this.expandedElement = this.expandedElement === row ? null : row
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
