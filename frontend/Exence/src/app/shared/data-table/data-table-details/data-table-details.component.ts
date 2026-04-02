import { Component, computed, inject, input } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoService } from '@jsverse/transloco';
import { Transaction } from '../../../data-model/modules/transaction/Transaction';
import { TransactionType } from '../../../data-model/modules/transaction/TransactionType';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { CurrencyService } from '../../currency.service';
import { DisplaySizeService } from '../../display-size.service';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { TranslatePipe } from '../../pipes/translate.pipe';

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

	// TODO remove & part when server DTO updated
	transaction = input.required<
		Transaction & { currency: SupportedCurrency; baseCurrencyAmount: number; exchangeRate: number }
	>();
	type = input<TransactionType | 'category'>();

	baseCurrency = computed<SupportedCurrency>(() => this.currencyService.baseCurrency());
	showBaseCurrency = computed<boolean>(() => this.currencyService.showBaseCurrency());

	readonly transactionTypes = TransactionType;

	localizeCurrency(currency: SupportedCurrency): string {
		const lang = this.translocoService.getActiveLang();
		const formatter = new Intl.NumberFormat(lang, {
			style: 'currency',
			currencyDisplay: 'narrowSymbol',
			currency: currency.toUpperCase(),
		});
		const symbol = formatter.formatToParts(0).find(part => part.type === 'currency');
		return symbol ? symbol.value : currency;
	}

	getTypeClass(amount: number): string {
		if (amount > 0) return 'income';
		if (amount < 0) return 'expense';
		return '';
	}
}
