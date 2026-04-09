import { InvestmentType } from './InvestmentType';

export interface InvestmentPatch {
	asset?: string;
	purchaseDate?: string; // yyyy-MM-dd
	type?: InvestmentType;
	amount?: number;
	note?: string | undefined;
}
