import { Category } from '../category/Category';
import { Transaction } from './Transaction';

export interface TransactionModel extends Transaction {
	category: Category;
}