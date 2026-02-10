import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';

export function getFilters(filters?: TransactionFilter): Record<string, string> {
	if (filters) return JSON.parse(JSON.stringify(filters)) as Record<string, string>;
	return {} satisfies Record<string, string>;
}
