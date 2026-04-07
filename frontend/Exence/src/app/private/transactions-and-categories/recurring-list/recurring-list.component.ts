import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
import { RecurringTransactionGet } from '../../../data-model/modules/transaction/RecurringTransactionGet';
import { RecurringTransactionCreate } from '../../../data-model/modules/transaction/RecurringTransactionCreate';
import { TransactionCreate } from '../../../data-model/modules/transaction/TransactionCreate';
import { PagedResponse } from '../../../data-model/modules/common/PagedResponse';
import { ColumnDef, DataTableComponent, TableAction } from '../../../shared/data-table/data-table.component';
import { ExCellDirective } from '../../../shared/data-table/ex-cell.directive';
import { RecurringStore } from '../recurring.store';
import { CategoryStore } from '../category.store';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { SvgIcons } from '../../../shared/svg-icons/svg-icons';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';
import {
	CreateTransactionDialogComponent,
	CreateTransactionDialogData,
} from '../create-transaction-dialog/create-transaction-dialog.component';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { MatLabel } from '@angular/material/form-field';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { TranslocoService } from '@jsverse/transloco';
import { localizeCurrency } from '../../../shared/util/utils';
import { OrdinalPipe } from '../../../shared/pipes/ordinal.pipe';
import { EndCondition } from '../../../data-model/modules/transaction/EndCondition';
import { RecurrenceFrequency } from '../../../data-model/modules/transaction/RecurrenceFrequency';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { DayOfWeek } from '../../../data-model/modules/transaction/DayOfWeek';

@Component({
	selector: 'ex-recurring-list',
	templateUrl: './recurring-list.component.html',
	styleUrl: './recurring-list.component.scss',
	imports: [
		MatIconModule,
		MatTooltipModule,
		MatLabel,
		DataTableComponent,
		ExCellDirective,
		CurrencyPipe,
		DatePipe,
		TranslatePipe,
		OrdinalPipe,
	],
})
export class RecurringListComponent {
	private readonly recurringStore = inject(RecurringStore);
	private readonly categoryStore = inject(CategoryStore);
	private readonly dialog = inject(DialogService);
	private readonly display = inject(DisplaySizeService);
	private readonly translocoService = inject(TranslocoService);

	type = input<TransactionType>();
	title = input<string>('');
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();

	readonly transactionTypes = TransactionType;
	readonly endConditions = EndCondition;
	readonly frequencies = RecurrenceFrequency;

	isLoading = computed(() => {
		const type = this.type();
		if (type === TransactionType.EXPENSE) return this.recurringStore.expenseResource.isLoading();
		if (type === TransactionType.INCOME) return this.recurringStore.incomeResource.isLoading();
		return this.recurringStore.transactionResource.isLoading();
	});

	data = computed<PagedResponse<RecurringTransactionGet> | undefined>(() => {
		const type = this.type();
		if (type === TransactionType.EXPENSE) return this.recurringStore.expenses();
		if (type === TransactionType.INCOME) return this.recurringStore.incomes();
		return this.recurringStore.transactions();
	});

	categoryMap = computed(() => {
		const categories = this.categoryStore.categoryResource.value() ?? [];
		return new Map(categories.map(c => [c.id, c]));
	});

	columns = computed<ColumnDef[]>(() => {
		const columns: ColumnDef[] = [];
		columns.push({ key: 'title', header: 'Title', width: '35%' });
		if (this.display.isMd())
			columns.push({
				key: 'nextDate',
				header: this.translocoService.translate('recurring.nextExecutionLabel'),
				width: '70px',
			});
		columns.push({ key: 'amount', header: this.translocoService.translate('literals.amount'), width: '120px' });
		columns.push({ key: 'category', header: this.translocoService.translate('literals.category'), width: '50px' });
		columns.push({ key: 'actions', header: '', width: '60px' });
		return columns;
	});

	actions: TableAction<RecurringTransactionGet>[] = [
		{
			label: 'Delete',
			icon: 'delete',
			color: 'var(--error-color)',
			handler: row => this.recurringStore.deleteRecurringTransaction(row),
		},
	];

	onScroll(): void {
		this.recurringStore.loadNextPage(this.type());
	}

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	getTypeClass(amount: number): string {
		if (amount > 0) return 'income';
		if (amount < 0) return 'expense';
		return '';
	}

	codeForFrequency(freq: RecurrenceFrequency): TranslationCode {
		return `recurring.details.frequency.${freq}`;
	}

	codeForDayOfWeek(day: DayOfWeek): TranslationCode {
		return `recurring.dayOfWeek.${day}.full`;
	}

	codeForEndCondition(cond: EndCondition): TranslationCode {
		return `recurring.ends.endCondition.${cond}`;
	}

	async openCreate(): Promise<void> {
		const result = await this.dialog.openNonModal<
			CreateTransactionDialogData,
			TransactionCreate | RecurringTransactionCreate | null
		>(
			CreateTransactionDialogComponent,
			this.type() ? { type: this.type()!, isRecurring: true } : { isRecurring: true },
		);
		if (!result) return;
		this.recurringStore.createRecurringTransaction(result as RecurringTransactionCreate);
	}
}
