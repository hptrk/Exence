import { SupportedCurrency } from '../user-settings/SupportedCurrency';
import { TransactionType } from './TransactionType';

export interface Transaction {
	id?: number;
	title: string;
	note?: string;
	date: string; // String to represent date in yyyy-MM-dd format
	amount: number;
	type: TransactionType;
	recurring: boolean;
	categoryId: number;

	// TODO check namings after currency on server has been implemented
	currency: SupportedCurrency;
	baseCurrencyAmount?: number;
	exchangeRate: number;
}
