import { SupportedCurrency } from '../user-settings/SupportedCurrency';
import { TransactionType } from './TransactionType';

export interface TransactionGet {
	id: number;
	title: string;
	note?: string;
	date: string; // String to represent date in yyyy-MM-dd format
	amount: number;
	type: TransactionType;
	createdByRecurringJob: boolean;
	recurringTransactionId?: number;
	categoryId: number;
	currency: SupportedCurrency;
	exchangeRate: number;
	baseCurrencyAmount: number;
}
