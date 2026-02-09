import { computed, effect, inject, resource, ResourceRef } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
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
		recurring: number;
		recurringIncome: number;
		recurringExpense: number;
	};
	filters?: TransactionFilter;
	data: {
		transactions: PagedResponse<Transaction>;
		incomes: PagedResponse<Transaction>;
		expenses: PagedResponse<Transaction>;
		recurrings: PagedResponse<Transaction>;
		recurringIncomes: PagedResponse<Transaction>;
		recurringExpenses: PagedResponse<Transaction>;
	};
}

const initialState: TransactionStoreData = {
	pages: {
		transaction: 0,
		income: 0,
		expense: 0,
		recurring: 0,
		recurringIncome: 0,
		recurringExpense: 0,
	},
	filters: {} as TransactionFilter,
	data: {
		transactions: {} as PagedResponse<Transaction>,
		incomes: {} as PagedResponse<Transaction>,
		expenses: {} as PagedResponse<Transaction>,
		recurrings: {} as PagedResponse<Transaction>,
		recurringIncomes: {} as PagedResponse<Transaction>,
		recurringExpenses: {} as PagedResponse<Transaction>,
	}
};

export const TransactionStore = signalStore(
	// TODO when private.component is created provide it there and user change will recreate the instance and reset data
	{ providedIn: 'root' },

	withState(initialState),

	withProps((store, transactionService = inject(TransactionService)) => ({
		transactionResource: resource<PagedResponse<Transaction>, { page: number; filters?: TransactionFilter | undefined }>({
			params: () => ({ page: store.pages().transaction, filters: store.filters ? store.filters() : undefined }),
			loader: async ({ params }) => await transactionService.list(params.filters, params.page)
		}),
		incomeResource: resource<PagedResponse<Transaction>, { page: number }>({
			params: () => ({ page: store.pages().income }),
			loader: async ({ params }) => await transactionService.listIncomes(params.page)
		}),
		expenseResource: resource<PagedResponse<Transaction>, { page: number }>({
			params: () => ({ page: store.pages().expense }),
			loader: async ({ params }) => await transactionService.listExpenses(params.page)
		}),
		totalResource: resource<TransactionTotalsResponse, undefined>({
			loader: async () => await transactionService.totals(), 
		}),
		recurringResource: resource<PagedResponse<Transaction>, { page: number }>({
			params: () => ({ page: store.pages().recurring }),
			loader: async ({ params }) => await transactionService.listRecurrings(params.page),
		}),
		recurringIncomeResource: resource<PagedResponse<Transaction>, { page: number }>({
			params: () => ({ page: store.pages().recurringIncome }),
			loader: async ({ params }) => await transactionService.listRecurringIncomes(params.page),
		}),
		recurringExpenseResource: resource<PagedResponse<Transaction>, { page: number }>({
			params: () => ({ page: store.pages().recurringExpense }),
			loader: async ({ params }) => await transactionService.listRecurringExpenses(params.page),
		}),
	})),

	withComputed((store) => ({
		transactions: computed(() => store.data.transactions()),
		incomes: computed(() => store.data.incomes()),
		expenses: computed(() => store.data.expenses()),
		totalIncome: computed(() => store.totalResource.value()?.totalIncome ?? 0),
		totalExpense: computed(() => store.totalResource.value()?.totalExpense ?? 0),
		balance: computed(() => {
			const incomes = store.totalResource.value()?.totalIncome ?? 0;
			const expenses = store.totalResource.value()?.totalExpense ?? 0;
			return Math.round(incomes - expenses) / 100 * 100;
		}),
		recurrings: computed(() => store.data.recurrings()),
		recurringIncomes: computed(() => store.data.recurringIncomes()),
		recurringExpenses: computed(() => store.data.recurringExpenses()),
	})),

	withMethods((
		store,
		transactionService = inject(TransactionService),
		snackbarService = inject(SnackbarService),
		categoryStore = inject(CategoryStore),
	) => {
		function reload(transaction: Transaction): void {
			const currentPages = store.pages();
			const currentData = store.data();
			const newPages = { ...currentPages };
			const newData = { ...currentData };

			switch (transaction.type) {
				case TransactionType.INCOME:
					newPages.income = 0;
					newData.incomes = {} as PagedResponse<Transaction>;
					store.incomeResource.reload();
					if (transaction.recurring) {
						newPages.recurringIncome = 0;
						newData.recurringIncomes = {} as PagedResponse<Transaction>;
						store.recurringIncomeResource.reload();
					}
					break;
				case TransactionType.EXPENSE:
					newPages.expense = 0;
					newData.expenses = {} as PagedResponse<Transaction>;
					store.expenseResource.reload();
					if (transaction.recurring) {
						newPages.recurringExpense = 0;
						newData.recurringExpenses = {} as PagedResponse<Transaction>;
						store.recurringExpenseResource.reload();
					}
					break;
			}
			newPages.transaction = 0;
			newData.transactions = {} as PagedResponse<Transaction>;
			store.transactionResource.reload();
			
			if (transaction.recurring) {
				newPages.recurring = 0;
				newData.recurrings = {} as PagedResponse<Transaction>;
				store.recurringResource.reload();
			}

			store.totalResource.reload();
			categoryStore.topCategoriesResource.reload();
			patchState(store, (state) => ({
				...state,
				pages: newPages,
				data: newData
			}));
		}

		function fullReload(): void {
			const newState: TransactionStoreData = { ...initialState, filters: { ...(store.filters ? store.filters() : {}) } as TransactionFilter };
			store.transactionResource.reload();
			store.incomeResource.reload();
			store.expenseResource.reload();
			store.totalResource.reload();
			store.recurringResource.reload();
			store.recurringIncomeResource.reload();
			store.recurringExpenseResource.reload();
			categoryStore.topCategoriesResource.reload();
			patchState(store, newState);
		}

		return {
			async createTransaction(request: Transaction): Promise<void> {
				const newTransaction = await transactionService.create(request);
				snackbarService.showSuccess(`Transaction '${newTransaction.title.slice(0, 10)}${newTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
				reload(request);
			},
			async updateTransaction(request: Transaction): Promise<void> {
				const updatedTransaction = await transactionService.update(request);
				snackbarService.showSuccess(`Transaction '${updatedTransaction.title.slice(0, 10)}${updatedTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
				fullReload();
			},
			async deleteTransaction(request: Transaction): Promise<void> {
				await transactionService.delete(request.id!);
				snackbarService.showSuccess('Transaction deleted successfully!');
				reload(request);
			},
			loadNextPage(type?: TransactionType, recurring?: boolean): void {
				const resourceMap = {
					[TransactionType.INCOME]: store.incomeResource,
					[TransactionType.EXPENSE]: store.expenseResource,
				};
				const res = type ? resourceMap[type] : store.transactionResource;
				if (!res.isLoading() && !res.value()?.last) {
					patchState(store, (state) => {
						const pages = { ...state.pages };
						if (recurring) {
							if (type === TransactionType.INCOME) pages.recurringIncome++;
							else if (type === TransactionType.EXPENSE) pages.recurringExpense++;
							else pages.recurring++;
						} else {
							if (type === TransactionType.INCOME) pages.income++;
							else if (type === TransactionType.EXPENSE) pages.expense++;
							else pages.transaction++;
						}
						return { ...state, pages };
					});
				}
			},
			updateFilters(filters: TransactionFilter): void {
				patchState(store, (state) => ({
					...state,
					filters: { ...filters },
					pages: { ...state.pages, transaction: 0 }
				}));
			},
			resetState(): void {
				fullReload();
			},
		};
	}),

	withHooks({
		onInit(store): void {
			function merge(
				type: keyof TransactionStoreData['data'],
				res: ResourceRef<PagedResponse<Transaction> | undefined>,
				page: number
			): void {
				const val = res.value();
				if (val && !res.isLoading()) {
					patchState(store, (state) => {
						if (page === 0) return { data: { ...state.data, [type]: val } };
						return {
							data: {
								...state.data,
								[type]: page === 0 
									? val 
									: { ...val, content: [...state.data[type].content ?? [], ...val.content ?? []] }
							}
						};
					});
				}
			}

			effect(() => merge('transactions', store.transactionResource, store.pages.transaction()));
			effect(() => merge('incomes', store.incomeResource, store.pages.income()));
			effect(() => merge('expenses', store.expenseResource, store.pages.expense()));
			effect(() => merge('recurrings', store.recurringResource, store.pages.recurring()));
			effect(() => merge('recurringIncomes', store.recurringIncomeResource, store.pages.recurringIncome()));
			effect(() => merge('recurringExpenses', store.recurringExpenseResource, store.pages.recurringExpense()));
		}
	}),
);