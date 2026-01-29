import { TransactionType } from './TransactionType';

export interface TransactionFilter {
	keyword?: string;
	dateFrom?: string;
	dateTo?: string;
	categoryId?: number;
	type?: TransactionType;
	amountFrom?: number;
	amountTo?: number;
	recurring?: boolean;
}