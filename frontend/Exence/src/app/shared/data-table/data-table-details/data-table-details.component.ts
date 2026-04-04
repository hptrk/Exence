import { Component, computed, inject, input } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoService } from '@jsverse/transloco';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { CurrencyService } from '../../currency.service';
import { DisplaySizeService } from '../../display-size.service';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { localizeCurrency } from '../../util/utils';
import { TransactionGet } from '../../../data-model/modules/transaction/TransactionGet';

@Component({
	selector: 'ex-data-table-details',
	templateUrl: './data-table-details.component.html',
	styleUrl: './data-table-details.component.scss',
	imports: [MatIconModule, MatLabel, CurrencyPipe, TranslatePipe],
})
export class DataTableDetailsComponent {
	private readonly translocoService = inject(TranslocoService);
	private readonly currencyService = inject(CurrencyService);
	readonly display = inject(DisplaySizeService);

	transaction = input.required<TransactionGet>();
	type = input<TransactionType | 'category'>();

	baseCurrency = computed<SupportedCurrency>(() => this.currencyService.baseCurrency());
	showBaseCurrency = computed<boolean>(() => this.currencyService.showBaseCurrency());

	readonly transactionTypes = TransactionType;

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	getTypeClass(amount: number): string {
		if (amount > 0) return 'income';
		if (amount < 0) return 'expense';
		return '';
	}
}
