import { SupportedCurrency } from '../user-settings/SupportedCurrency';
import { InvestmentType } from './InvestmentType';

export interface InvestmentGet {
	id: number;
	asset: string;
	purchaseDate: string; // yyyy-MM-dd
	type: InvestmentType;
	amount: number;
	currency: SupportedCurrency;
	baseCurrencyAmount: number;
	note: string | null;
}
