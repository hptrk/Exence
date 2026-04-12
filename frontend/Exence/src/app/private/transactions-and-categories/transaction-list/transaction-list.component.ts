import { DatePipe } from '@angular/common';
import { booleanAttribute, Component, computed, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PagedResponse } from '../../../data-model/modules/common/PagedResponse';
import { RecurringTransactionCreate } from '../../../data-model/modules/transaction/RecurringTransactionCreate';
import { TransactionCreate } from '../../../data-model/modules/transaction/TransactionCreate';
import { TransactionGet } from '../../../data-model/modules/transaction/TransactionGet';
import { TransactionModel } from '../../../data-model/modules/transaction/TransactionModel';
import { TransactionPatch } from '../../../data-model/modules/transaction/TransactionPatch';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
import { CurrencyService } from '../../../shared/currency.service';
import { ColumnDef, DataTableComponent, TableAction } from '../../../shared/data-table/data-table.component';
import { ExCellDirective } from '../../../shared/data-table/ex-cell.directive';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { SvgIcons } from '../../../shared/svg-icons/svg-icons';
import { CategoryStore } from '../category.store';
import {
	CreateTransactionDialogComponent,
	CreateTransactionDialogData,
	CreateTransactionDialogResult,
} from '../create-transaction-dialog/create-transaction-dialog.component';
import {
	EditTransactionDialogComponent,
	EditTransactionDialogData,
} from '../edit-transaction-dialog/edit-transaction-dialog.component';
import { RecurringStore } from '../recurring.store';
import { TransactionStore } from '../transaction.store';
import { TransactionListDetailsComponent } from './transaction-list-details/transaction-list-details.component';
import { TranslocoService } from '@jsverse/transloco';
import {
	MessageDialogButtonConfig,
	MessageDialogComponent,
	PredefiedButtons,
} from '../../../shared/message-dialog/message-dialog.component';
import { format } from 'date-fns';

@Component({
	selector: 'ex-transaction-list',
	templateUrl: './transaction-list.component.html',
	styleUrl: './transaction-list.component.scss',
	imports: [
		MatIconModule,
		MatTooltipModule,
		DataTableComponent,
		TransactionListDetailsComponent,
		ExCellDirective,
		CurrencyPipe,
		DatePipe,
	],
})
export class TransactionListComponent {
	private readonly transactionStore = inject(TransactionStore);
	private readonly recurringStore = inject(RecurringStore);
	private readonly categoryStore = inject(CategoryStore);
	private readonly dialog = inject(DialogService);
	private readonly currencyService = inject(CurrencyService);
	private readonly translocoService = inject(TranslocoService);
	readonly display = inject(DisplaySizeService);

	type = input<TransactionType>();
	title = input<string>('');
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();
	nonExpandable = input(false, { transform: booleanAttribute });

	readonly transactionTypes = TransactionType;

	showBaseCurrency = computed(() => this.currencyService.showBaseCurrency());

	data = computed<PagedResponse<TransactionModel> | undefined>(() => {
		const categories = this.categoryStore.categoryResource.value();
		if (!categories) return undefined;

		const raw = this.getRawData();
		if (!raw?.content) return raw as PagedResponse<TransactionModel> | undefined;

		return {
			...raw,
			content: raw.content.map(t => ({
				...t,
				category: categories.find(c => c.id === t.categoryId)!,
			})),
		};
	});

	isLoading = computed(() => {
		const type = this.type();
		if (type === TransactionType.EXPENSE) return this.transactionStore.expenseResource.isLoading();
		if (type === TransactionType.INCOME) return this.transactionStore.incomeResource.isLoading();
		return this.transactionStore.transactionResource.isLoading();
	});

	columns = computed<ColumnDef[]>(() => {
		const columns: ColumnDef[] = [];
		columns.push({
			key: 'title',
			header: this.translocoService.translate('transactionsAndCategories.title'),
			width: '35%',
		});
		if (this.display.isMd())
			columns.push({
				key: 'date',
				header: this.translocoService.translate('transactionsAndCategories.date'),
				width: '70px',
			});
		columns.push({ key: 'amount', header: this.translocoService.translate('literals.amount'), width: '120px' });
		columns.push({ key: 'category', header: this.translocoService.translate('literals.category'), width: '50px' });
		if (!this.nonExpandable()) columns.push({ key: 'actions', header: '', width: '60px' });
		return columns;
	});

	actions: TableAction<TransactionModel>[] = [
		{
			label: this.translocoService.translate('transactionsAndCategories.duplicate'),
			icon: 'add_box',
			handler: row => this.dupliateTransaction(row),
			disabled: row => row.createdByRecurringJob,
		},
		{
			label: this.translocoService.translate('literals.edit'),
			icon: 'edit',
			handler: row => this.editTransaction(row),
		},
		{
			label: this.translocoService.translate('literals.delete'),
			icon: 'delete',
			color: 'var(--error-color)',
			handler: row => this.transactionStore.deleteTransaction(row),
		},
	];

	onScroll(): void {
		this.transactionStore.loadNextPage(this.type());
	}

	async openCreate(): Promise<void> {
		const result = await this.dialog.openNonModal<
			CreateTransactionDialogData | undefined,
			CreateTransactionDialogResult | null
		>(CreateTransactionDialogComponent, this.type() ? { type: this.type()! } : undefined);
		if (!result) return;
		if (result.isRecurring) {
			this.recurringStore.createRecurringTransaction(result.result as RecurringTransactionCreate);
		} else {
			this.transactionStore.createTransaction(result.result as TransactionCreate);
		}
	}

	private async dupliateTransaction(row: TransactionModel): Promise<void> {
		const result = await this.dialog.openModal(MessageDialogComponent, {
			title: this.translocoService.translate('transactionsAndCategories.duplicateTitle', { title: row.title }),
			message: this.translocoService.translate('transactionsAndCategories.duplicateMessage'),
			hideCloseIcon: false,
			buttons: MessageDialogButtonConfig.custom(
				{
					text: this.translocoService.translate('transactionsAndCategories.duplicate'),
					value: true,
					color: 'primary',
					iconPositionEnd: true,
					matIcon: 'add_box',
				},
				PredefiedButtons.CANCEL,
			),
		});
		if (!result) return;
		const request: TransactionCreate = {
			title: row.title,
			note: row.note ?? '',
			date: format(new Date(), 'yyyy-MM-dd'),
			amount: row.amount,
			type: row.type,
			categoryId: row.categoryId,
			currency: row.currency,
			exchangeRate: row.exchangeRate,
		};
		this.transactionStore.createTransaction(request);
	}

	private async editTransaction(row: TransactionModel): Promise<void> {
		const result = await this.dialog.openNonModal<EditTransactionDialogData, TransactionPatch | null>(
			EditTransactionDialogComponent,
			{ transaction: row },
		);
		if (!result) return;
		this.transactionStore.updateTransaction(row.id, result);
	}

	private getRawData(): PagedResponse<TransactionGet> | undefined {
		const type = this.type();
		if (type === TransactionType.EXPENSE) return this.transactionStore.expenses();
		if (type === TransactionType.INCOME) return this.transactionStore.incomes();
		return this.transactionStore.transactions();
	}
}
