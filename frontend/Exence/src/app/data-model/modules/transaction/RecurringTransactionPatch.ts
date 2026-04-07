import { SupportedCurrency } from '../user-settings/SupportedCurrency';
import { DayOfWeek } from './DayOfWeek';
import { EndCondition } from './EndCondition';
import { RecurrenceFrequency } from './RecurrenceFrequency';
import { TransactionType } from './TransactionType';

export interface RecurringTransactionPatch {
	title?: string;
	note?: string;
	amount?: number;
	type?: TransactionType;
	categoryId?: number;
	currency?: SupportedCurrency;
	frequency?: RecurrenceFrequency;
	interval?: number;
	dayOfWeek?: DayOfWeek;
	dayOfMonth?: number;
	endCondition?: EndCondition;
	endDate?: string; // yyyy-MM-dd
	maxOccurrence?: number;
	startDate?: string; // yyyy-MM-dd
}
