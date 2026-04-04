import { CategoryGet } from '../category/CategoryGet';
import { TransactionGet } from './TransactionGet';

export interface TransactionModel extends TransactionGet {
	category: CategoryGet;
}
