import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoService } from '@jsverse/transloco';
import { differenceInDays, parseISO } from 'date-fns';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { DebtGet } from '../../../data-model/modules/debt/DebtGet';
import { DebtCreate } from '../../../data-model/modules/debt/DebtCreate';
import { DebtStatus } from '../../../data-model/modules/debt/DebtStatus';
import { DebtType } from '../../../data-model/modules/debt/DebtType';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { CurrencyService } from '../../../shared/currency.service';
import { ColumnDef, DataTableComponent, TableAction } from '../../../shared/data-table/data-table.component';
import { ExCellDirective } from '../../../shared/data-table/ex-cell.directive';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { SvgIcons } from '../../../shared/svg-icons/svg-icons';
import { localizeCurrency } from '../../../shared/util/utils';
import { CategoryStore } from '../../transactions-and-categories/category.store';
import { CreateDebtDialogComponent } from '../create-debt-dialog/create-debt-dialog.component';
import { DebtStore } from '../debt.store';
import {
	EditDebtDialogComponent,
	EditDebtDialogData,
	EditDebtDialogResult,
} from '../edit-debt-dialog/edit-debt-dialog.component';

export interface DebtModel extends DebtGet {
	category?: CategoryGet | undefined;
}

@Component({
	selector: 'ex-debt-list',
	templateUrl: './debt-list.component.html',
	styleUrl: './debt-list.component.scss',
	imports: [
		CommonModule,
		MatIconModule,
		MatTooltipModule,
		MatLabel,
		MatProgressBarModule,
		DataTableComponent,
		ExCellDirective,
		TranslatePipe,
		CurrencyPipe,
	],
})
export class DebtListComponent {
	private readonly currencyService = inject(CurrencyService);
	private readonly translocoService = inject(TranslocoService);
	private readonly store = inject(DebtStore);
	private readonly categoryStore = inject(CategoryStore);
	private readonly dialog = inject(DialogService);
	readonly display = inject(DisplaySizeService);

	title = input<string>('');
	matIcon = input<string>();
	svgIcon = input<SvgIcons>();
	type = input<DebtType>();

	data = computed<DebtModel[]>(() => {
		const categories = this.categoryStore.categoryResource.value();
		const type = this.type();
		const raw = this.store.debts();
		if (!raw.length) return [];

		const filtered = type ? raw.filter(d => d.type === type) : raw;

		return filtered.map(d => ({
			...d,
			category: categories?.find(c => c.id === d.categoryId),
		}));
	});

	isLoading = computed<boolean>(() => this.store.debtResource.isLoading());

	columns = computed<ColumnDef[]>(() => {
		const columns: ColumnDef[] = [];
		columns.push({ key: 'title', header: 'debts.titleLabel', width: '35%' });
		columns.push({ key: 'remaining', header: 'literals.amount', width: '120px' });
		if (this.display.isMd()) columns.push({ key: 'days', header: 'debts.days', width: '70px' });
		columns.push({ key: 'category', header: 'literals.category', width: '50px' });
		columns.push({ key: 'actions', header: '', width: '60px' });
		return columns;
	});

	showBaseCurrency = computed<boolean>(() => this.currencyService.showBaseCurrency());
	baseCurrency = computed<SupportedCurrency>(() => this.currencyService.baseCurrency());

	actions: TableAction<DebtModel>[] = [
		{
			label: 'literals.edit',
			icon: 'edit',
			handler: row => this.edit(row),
		},
		{
			label: 'literals.delete',
			icon: 'delete',
			color: 'var(--error-color)',
			handler: row => this.store.deleteDebt(row.id),
		},
	];

	daysUntilDeadline(deadline: string | null): number | null {
		if (!deadline) return null;
		return differenceInDays(parseISO(deadline), new Date());
	}

	codeForStatus(status: DebtStatus): TranslationCode {
		return `debts.status.${status}`;
	}

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	async openCreate(): Promise<void> {
		const result = await this.dialog.openNonModal(CreateDebtDialogComponent, this.type());
		if (!result) return;
		this.store.createDebt(result as DebtCreate);
	}

	private async edit(row: DebtModel): Promise<void> {
		const result = await this.dialog.openNonModal<EditDebtDialogData, EditDebtDialogResult>(
			EditDebtDialogComponent,
			{ debt: row },
		);
		if (!result) return;
		if (result.action === 'save') {
			this.store.updateDebt(row.id, result.patch);
		} else {
			this.store.makePayment(row.id, result.payment);
		}
	}
}
