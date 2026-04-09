import { SupportedCurrency } from '../user-settings/SupportedCurrency';
import { GoalStatus } from './GoalStatus';

export interface GoalGet {
	id: number;
	title: string;
	description: string;
	targetAmount: number;
	currentAmount: number;
	targetBaseCurrencyAmount: number;
	currentBaseCurrencyAmount: number;
	currency: SupportedCurrency;
	deadline: string; // yyyy-MM-dd
	status: GoalStatus;
	categoryId: number;
	progressPercentage: number;
}
