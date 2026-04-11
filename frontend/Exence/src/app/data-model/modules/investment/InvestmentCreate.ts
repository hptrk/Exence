import { SupportedCurrency } from '../user-settings/SupportedCurrency';
import { InvestmentType } from './InvestmentType';

export interface InvestmentCreate {
	asset: string;
	purchaseDate: string; // yyyy-MM-dd
	type: InvestmentType;
	amount: number;
	currency: SupportedCurrency;
	note?: string;
}
