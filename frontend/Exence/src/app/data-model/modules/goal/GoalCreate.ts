import { SupportedCurrency } from '../user-settings/SupportedCurrency';

export interface GoalCreate {
	title: string;
	description?: string;
	targetAmount: number;
	initialAmount?: number;
	currency: SupportedCurrency;
	deadline: string; // yyyy-MM-dd
	categoryId: number;
}
