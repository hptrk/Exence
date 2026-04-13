import { SankeyLink } from '../../../app/data-model/modules/statistics/WidgetDataPayload';
import { TransactionFilter } from '../../../app/data-model/modules/transaction/TransactionFilter';
import { TransactionType } from '../../../app/data-model/modules/transaction/TransactionType';

export const simpleSankeyLinks: SankeyLink[] = [
	{ from: 'Salary', to: 'Food', value: 500, color: '#ff0000' },
	{ from: 'Salary', to: 'Rent', value: 1000, color: '#ff0000' },
];

export const mixedSankeyLinks: SankeyLink[] = [
	{ from: 'Salary', to: 'Savings', value: 300, color: '#00ff00' },
	{ from: 'Savings', to: 'Investment', value: 200, color: '#0000ff' },
];

export const hubSankeyLinks: SankeyLink[] = [
	{ from: 'Income', to: 'Hub', value: 100, color: '#aaaaaa' },
	{ from: 'Bonus', to: 'Hub', value: 200, color: '#bbbbbb' },
	{ from: 'Hub', to: 'Food', value: 150, color: '#cccccc' },
	{ from: 'Hub', to: 'Rent', value: 150, color: '#dddddd' },
];

export const fullTransactionFilter: TransactionFilter = {
	keyword: 'groceries',
	dateFrom: '2024-01-01',
	dateTo: '2024-12-31',
	categoryId: 42,
	type: TransactionType.EXPENSE,
	amountFrom: 10.5,
	amountTo: 500.0,
	createdByRecurringJob: true,
};
