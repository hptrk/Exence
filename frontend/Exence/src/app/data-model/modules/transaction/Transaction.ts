import { Category } from '../category/Category';
import { TransactionType } from './TransactionType';

export interface Transaction {
	id?: number;
	title: string;
	note?: string;
	date: string; // String to represent date in ISO format
	amount: number;
	type: TransactionType;
	recurring: boolean;
	categoryId: number;
}
