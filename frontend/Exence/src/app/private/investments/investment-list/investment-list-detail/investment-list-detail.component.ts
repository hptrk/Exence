import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvestmentGet } from '../../../../data-model/modules/investment/InvestmentGet';
import { InvestmentPatch } from '../../../../data-model/modules/investment/InvestmentPatch';
import { InvestmentType } from '../../../../data-model/modules/investment/InvestmentType';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { CurrencyService } from '../../../../shared/currency.service';
import { DialogService } from '../../../../shared/dialog/dialog.service';
import { TranslationCode } from '../../../../shared/i18n/translation-types';
import { CurrencyPipe } from '../../../../shared/pipes/currency.pipe';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import {
	EditInvestmentDialogComponent,
	EditInvestmentDialogData,
} from '../../edit-investment-dialog/edit-investment-dialog.component';
import { InvestmentStore } from '../../investment.store';

@Component({
	selector: 'ex-investment-list-detail',
	templateUrl: './investment-list-detail.component.html',
	styleUrl: './investment-list-detail.component.scss',
	imports: [MatTooltipModule, CurrencyPipe, TranslatePipe, DatePipe, ButtonComponent],
})
export class InvestmentListDetailComponent {
	private readonly store = inject(InvestmentStore);
	private readonly dialog = inject(DialogService);
	private readonly currencyService = inject(CurrencyService);

	purchases = input.required<InvestmentGet[]>();

	showBaseCurrency = computed(() => this.currencyService.showBaseCurrency());

	codeForType(type: InvestmentType): TranslationCode {
		return `investments.type_label.${type}`;
	}

	async editPurchase(purchase: InvestmentGet): Promise<void> {
		const existingAssets = this.store.investments().map(g => ({ name: g.name, type: g.type }));
		const result = await this.dialog.openNonModal<EditInvestmentDialogData, InvestmentPatch | null>(
			EditInvestmentDialogComponent,
			{ investment: purchase, existingAssets },
		);
		if (!result) return;
		this.store.updateInvestment(purchase.id, result);
	}

	deletePurchase(id: number): void {
		this.store.deleteInvestment(id);
	}
}
