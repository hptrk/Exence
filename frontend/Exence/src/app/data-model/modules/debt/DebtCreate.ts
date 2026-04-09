import { SupportedCurrency } from '../user-settings/SupportedCurrency';
import { DebtType } from './DebtType';

export interface DebtCreate {
	title: string;
	counterpartyName: string;
	originalAmount: number;
	currency: SupportedCurrency;
	deadline?: string;
	type: DebtType;
	categoryId: number;
}
