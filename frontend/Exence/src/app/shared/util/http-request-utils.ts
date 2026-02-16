import { CategoryFilter } from '../../data-model/modules/category/CategoryFilter';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';

export function getFilters(filters?: TransactionFilter | CategoryFilter): Record<string, string> {
	if (filters) return JSON.parse(JSON.stringify(filters)) as Record<string, string>;
	return {} satisfies Record<string, string>;
}
