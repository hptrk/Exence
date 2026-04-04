import { SupportedCurrency } from '../user-settings/SupportedCurrency';
import { TransactionType } from './TransactionType';

export interface TransactionCreate {
	title: string;
	note?: string;
	date: string; // String to represent date in yyyy-MM-dd format
	amount: number;
	type: TransactionType;
	recurring: boolean;
	categoryId: number;
	currency: SupportedCurrency;
	exchangeRate: number;
}
