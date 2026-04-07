import { SupportedCurrency } from '../user-settings/SupportedCurrency';
import { DayOfWeek } from './DayOfWeek';
import { EndCondition } from './EndCondition';
import { RecurrenceFrequency } from './RecurrenceFrequency';
import { TransactionType } from './TransactionType';

export interface RecurringTransactionGet {
	id: number;
	title: string;
	note?: string;
	amount: number;
	type: TransactionType;
	categoryId: number;
	currency: SupportedCurrency;
	frequency: RecurrenceFrequency;
	interval: number;
	dayOfWeek?: DayOfWeek;
	dayOfMonth?: number;
	endCondition: EndCondition;
	endDate?: string; // yyyy-MM-dd
	maxOccurrences?: number;
	currentOccurrences: number;
	nextExecutionDate?: string; // yyyy-MM-dd
	active: boolean;
}
