import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { SupportedCurrency } from '../../data-model/modules/user-settings/SupportedCurrency';
import { CurrencyService } from '../currency.service';

@Pipe({ name: 'currency', pure: false })
export class CurrencyPipe implements PipeTransform {
	private readonly currencyService = inject(CurrencyService);
	private readonly translocoService = inject(TranslocoService);

	transform(value?: number | string | null, _currency?: SupportedCurrency): string {
		if (value === undefined || value === null) return '';

		const numericValue = typeof value === 'string' ? parseFloat(value) : value;
		if (isNaN(numericValue)) return String(value);

		// TODO uncomment when showBaseCurrency is implemented on server
		// const resolvedCurrency = this.currencyService.showBaseCurrency()
		// 	? this.currencyService.baseCurrency()
		// 	: currency;
		const resolvedCurrency = this.currencyService.baseCurrency();
		const lang = this.translocoService.getActiveLang();

		return new Intl.NumberFormat(lang, {
			style: 'currency',
			currency: resolvedCurrency.toUpperCase(),
			currencyDisplay: 'symbol',
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(numericValue);
	}
}
