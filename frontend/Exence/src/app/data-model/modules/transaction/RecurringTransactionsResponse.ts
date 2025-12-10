import { PagedResponse } from "../common/PagedResponse";
import { Transaction } from "./Transaction";

export interface RecurringTransactionsResponse {
	incomes: PagedResponse<Transaction>;
	expenses: PagedResponse<Transaction>;
	mergedTransactions: PagedResponse<Transaction>;
}