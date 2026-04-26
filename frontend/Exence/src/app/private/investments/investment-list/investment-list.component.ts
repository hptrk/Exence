import { Component, computed, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { InvestmentCreate } from '../../../data-model/modules/investment/InvestmentCreate';
import { InvestmentGroup } from '../../../data-model/modules/investment/InvestmentGroup';
import { InvestmentType } from '../../../data-model/modules/investment/InvestmentType';

export interface InvestmentGroupRow extends InvestmentGroup {
	id: number;
}

import { MatTooltipModule } from '@angular/material/tooltip';
import { ColumnDef, DataTableComponent, TableAction } from '../../../shared/data-table/data-table.component';
import { ExCellDirective } from '../../../shared/data-table/ex-cell.directive';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import {
	CreateInvestmentDialogComponent,
	CreateInvestmentDialogData,
} from '../create-investment-dialog/create-investment-dialog.component';
import { InvestmentStore } from '../investment.store';
import { InvestmentListDetailComponent } from './investment-list-detail/investment-list-detail.component';

@Component({
	selector: 'ex-investment-list',
	templateUrl: './investment-list.component.html',
	styleUrl: './investment-list.component.scss',
	imports: [
		MatTooltipModule,
		DataTableComponent,
		ExCellDirective,
		TranslatePipe,
		CurrencyPipe,
		InvestmentListDetailComponent,
	],
})
export class InvestmentListComponent {
	private readonly store = inject(InvestmentStore);
	private readonly dialog = inject(DialogService);
	private readonly translocoService = inject(TranslocoService);
	readonly display = inject(DisplaySizeService);

	data = computed<InvestmentGroupRow[]>(() =>
		this.store.investments().map((group, index) => ({ ...group, id: index })),
	);
	isLoading = computed<boolean>(() => this.store.investmentResource.isLoading());

	columns = computed<ColumnDef[]>(() => {
		const cols: ColumnDef[] = [];
		cols.push({ key: 'title', header: 'investments.name', width: 'auto' });
		if (this.display.isMd()) cols.push({ key: 'lastAction', header: 'investments.lastAction', width: '110px' });
		cols.push({ key: 'totalInvested', header: 'literals.amount', width: '20%', minWidth: '150px' });
		if (this.display.isMd()) cols.push({ key: 'type', header: 'investments.type', width: '80px' });
		cols.push({ key: 'purchases', header: 'investments.transactions', width: '120px' });
		cols.push({ key: 'actions', header: '', width: '60px' });
		return cols;
	});

	actions: TableAction<InvestmentGroupRow>[] = [
		{
			label: 'investments.addPurchase',
			icon: 'add',
			handler: row => this.openAddPurchase(row),
		},
	];

	codeForType(type: InvestmentType): TranslationCode {
		return `investments.type_label.${type}`;
	}

	async openCreate(): Promise<void> {
		const title = this.translocoService.translate('investments.create.newAssetTitle');
		const existingAssets = this.data().map(g => ({ name: g.name, type: g.type }));
		const result = await this.dialog.openNonModal<CreateInvestmentDialogData, InvestmentCreate | null>(
			CreateInvestmentDialogComponent,
			{ title, assetName: null, locked: false, existingAssets },
		);
		if (!result) return;
		this.store.createInvestment(result);
	}

	async openAddPurchase(group: InvestmentGroupRow): Promise<void> {
		const title = this.translocoService.translate('investments.create.addPurchaseTitle');
		const result = await this.dialog.openNonModal<CreateInvestmentDialogData, InvestmentCreate | null>(
			CreateInvestmentDialogComponent,
			{ title, assetName: group.name, locked: true, lockedType: group.type, existingAssets: [] },
		);
		if (!result) return;
		this.store.createInvestment(result);
	}
}
