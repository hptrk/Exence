import { SupportedCurrency } from '../user-settings/SupportedCurrency';
import { DebtStatus } from './DebtStatus';
import { DebtType } from './DebtType';

export interface DebtGet {
	id: number;
	title: string;
	counterpartyName: string;
	originalAmount: number;
	remainingAmount: number;
	originalBaseCurrencyAmount: number;
	remainingBaseCurrencyAmount: number;
	currency: SupportedCurrency;
	deadline: string | null;
	type: DebtType;
	status: DebtStatus;
	categoryId: number;
	paidPercentage: number;
}
