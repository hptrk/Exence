import { computed, inject, resource } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { RecurringTransactionsResponse } from '../../data-model/modules/transaction/RecurringTransactionsResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionTotalsResponse } from '../../data-model/modules/transaction/TransactionTotalsResponse';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { CategoryStore } from './category.store';
import { TransactionService } from './transaction.service';

export interface TransactionStoreData {
	pages: {
		transaction: number;
		income: number;
		expense: number;
	};
	filters?: TransactionFilter;
}

const initialState: TransactionStoreData = {
	pages: {
		transaction: 0,
		income: 0,
		expense: 0,
	},
	filters: {} as TransactionFilter
};

export const TransactionStore = signalStore(
	withState(initialState),

	withProps(store => {
		const transactionService = inject(TransactionService);
		return {
			transactionResource: resource<PagedResponse<Transaction>, { page: number; filters?: TransactionFilter | undefined }>({
				params: () => ({ page: store.pages().transaction, filters: store.filters ? store.filters() : undefined }),
				loader: async ({ params }) => {
					return await transactionService.list(params.filters, params.page);
				}
			}),
			incomeResource: resource<PagedResponse<Transaction>, { page: number }>({
				params: () => ({ page: store.pages().income }),
				loader: async ({ params }) => {
					return await transactionService.listIncomes(params.page);
				}
			}),
			expenseResource: resource<PagedResponse<Transaction>, { page: number }>({
				params: () => ({ page: store.pages().expense }),
				loader: async ({ params }) => {
					return await transactionService.listExpenses(params.page);
				}
			}),
			totalResource: resource<TransactionTotalsResponse, undefined>({
				loader: async () => await transactionService.totals(), 
			}),
			recurringResource: resource<RecurringTransactionsResponse, undefined>({
				loader: async () => await transactionService.listRecurrings(),
			}),
		};
	}),

	withComputed(store => ({
		totalIncome: computed(() => store.totalResource.value()?.totalIncome ?? 0),
		totalExpense: computed(() => store.totalResource.value()?.totalExpense ?? 0),
		balance: computed(() => {
			const incomes = store.totalResource.value()?.totalIncome ?? 0;
			const expenses = store.totalResource.value()?.totalExpense ?? 0;
			return Math.round(incomes - expenses) / 100 * 100;
		}),
		recurringIncomes: computed(() => store.recurringResource.value()?.incomes),
		recurringExpenses: computed(() => store.recurringResource.value()?.expenses),
		recurrings: computed(() => store.recurringResource.value()?.mergedTransactions)
	})),

	withMethods(store => {
		const transactionService = inject(TransactionService);
		const snackbarService = inject(SnackbarService);
		const categoryStore = inject(CategoryStore);

		function triggerReload(type?: TransactionType): void {
			switch (type) {
				case TransactionType.INCOME:
					store.incomeResource.reload();
					break;
				case TransactionType.EXPENSE:
					store.expenseResource.reload();
					break;
			}
			store.transactionResource.reload();
			store.totalResource.reload();
			store.recurringResource.reload();
			categoryStore.topCategoriesResource.reload();
			patchState(store, initialState);

		}

		function triggerFullReload(): void {
			store.incomeResource.reload();
			store.expenseResource.reload();
			store.transactionResource.reload();
			store.totalResource.reload();
			store.recurringResource.reload();
			categoryStore.topCategoriesResource.reload();
			patchState(store, initialState);
		}

		return {
			async createTransaction(request: Transaction): Promise<void> {
				const newTransaction = await transactionService.create(request);
				snackbarService.showSuccess(`Transaction '${newTransaction.title.slice(0, 10)}${newTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
				triggerReload(request.type);
			},
			async updateTransaction(request: Transaction): Promise<void> {
				const updatedTransaction = await transactionService.update(request);
				snackbarService.showSuccess(`Transaction '${updatedTransaction.title.slice(0, 10)}${updatedTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
				triggerFullReload();
			},
			async deleteTransaction(id: number, type: TransactionType): Promise<void> {
				await transactionService.delete(id, type);
				snackbarService.showSuccess('Transaction deleted successfully!');
				triggerReload(type);
			},
			loadNextPage(type?: TransactionType): void {
				const res = !type ? 
					store.transactionResource :
					(type === TransactionType.INCOME ?
						store.incomeResource :
						store.expenseResource);
				if (!res.isLoading() && !res.value()?.last) {
					patchState(store, (state) => {
						const pages = { ...state.pages };
						switch (type) {
							case TransactionType.INCOME:
								pages.income++;
								break;
							case TransactionType.EXPENSE:
								pages.expense++;
								break;
							default:
								pages.transaction++;
						}
						return { pages };
					});
				}
			},
			updateFilters(filters: TransactionFilter): void {
				patchState(store, (state) => ({
					...state,
					filters: { ...filters },
				}));
			}
		};
	}),
);