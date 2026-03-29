import { Injectable, signal } from '@angular/core';
import { SupportedCurrency } from '../data-model/modules/user-settings/SupportedCurrency';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
	private _baseCurrency = signal<SupportedCurrency>(SupportedCurrency.HUF);
	private _showBaseCurrency = signal<boolean>(false);

	baseCurrency = this._baseCurrency.asReadonly();
	showBaseCurrency = this._showBaseCurrency.asReadonly();

	setBaseCurrency(currency: SupportedCurrency): void {
		this._baseCurrency.set(currency);
	}

	useBaseCurrency(show: boolean): void {
		this._showBaseCurrency.set(show);
	}
}
