import { InvestmentGet } from './InvestmentGet';
import { InvestmentType } from './InvestmentType';

export interface InvestmentGroup {
	name: string;
	daysSinceLastAction: number;
	totalInvested: number;
	type: InvestmentType;
	purchasesCount: number;
	purchases: InvestmentGet[];
}
