import { computed, effect, inject, resource, ResourceRef, untracked } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { CurrencyService } from '../../shared/currency.service';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { Transaction } from '../../data-model/modules/transaction/Transaction';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionTotalsResponse } from '../../data-model/modules/transaction/TransactionTotalsResponse';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { CategoryStore } from './category.store';
import { TransactionService } from './transaction.service';
import { TranslocoService } from '@jsverse/transloco';

export interface TransactionStoreData {
	// Page
	transactionPage: number;
	incomePage: number;
	expensePage: number;
	recurringPage: number;
	recurringIncomePage: number;
	recurringExpensePage: number;

	filters?: TransactionFilter;

	// Data caches
	transactions: PagedResponse<Transaction>;
	incomes: PagedResponse<Transaction>;
	expenses: PagedResponse<Transaction>;
	recurrings: PagedResponse<Transaction>;
	recurringIncomes: PagedResponse<Transaction>;
	recurringExpenses: PagedResponse<Transaction>;
}

const initialState: TransactionStoreData = {
	transactionPage: 0,
	incomePage: 0,
	expensePage: 0,
	recurringPage: 0,
	recurringIncomePage: 0,
	recurringExpensePage: 0,

	filters: {} as TransactionFilter,

	transactions: {} as PagedResponse<Transaction>,
	incomes: {} as PagedResponse<Transaction>,
	expenses: {} as PagedResponse<Transaction>,
	recurrings: {} as PagedResponse<Transaction>,
	recurringIncomes: {} as PagedResponse<Transaction>,
	recurringExpenses: {} as PagedResponse<Transaction>,
};

export const TransactionStore = signalStore(
	withState(initialState),

	withProps((store, transactionService = inject(TransactionService)) => ({
		transactionResource: resource<
			PagedResponse<Transaction>,
			{ page: number; filters?: TransactionFilter | undefined }
		>({
			params: () => ({ page: store.transactionPage(), filters: store.filters ? store.filters() : undefined }),
			loader: async ({ params }) => await transactionService.list(params.filters, params.page),
		}),
		incomeResource: resource<PagedResponse<Transaction>, { page: number }>({
			params: () => ({ page: store.incomePage() }),
			loader: async ({ params }) => await transactionService.listIncomes(params.page),
		}),
		expenseResource: resource<PagedResponse<Transaction>, { page: number }>({
			params: () => ({ page: store.expensePage() }),
			loader: async ({ params }) => await transactionService.listExpenses(params.page),
		}),
		totalResource: resource<TransactionTotalsResponse, undefined>({
			loader: async () => await transactionService.totals(),
		}),
		recurringResource: resource<PagedResponse<Transaction>, { page: number }>({
			params: () => ({ page: store.recurringPage() }),
			loader: async ({ params }) => await transactionService.listRecurrings(params.page),
		}),
		recurringIncomeResource: resource<PagedResponse<Transaction>, { page: number }>({
			params: () => ({ page: store.recurringIncomePage() }),
			loader: async ({ params }) => await transactionService.listRecurringIncomes(params.page),
		}),
		recurringExpenseResource: resource<PagedResponse<Transaction>, { page: number }>({
			params: () => ({ page: store.recurringExpensePage() }),
			loader: async ({ params }) => await transactionService.listRecurringExpenses(params.page),
		}),
	})),

	withComputed(store => ({
		totalIncome: computed(() => store.totalResource.value()?.totalIncome ?? 0),
		totalExpense: computed(() => store.totalResource.value()?.totalExpense ?? 0),
		balance: computed(() => {
			const incomes = store.totalResource.value()?.totalIncome ?? 0;
			const expenses = store.totalResource.value()?.totalExpense ?? 0;
			return (Math.round(incomes - expenses) / 100) * 100;
		}),
	})),

	withMethods(
		(
			store,
			transactionService = inject(TransactionService),
			snackbarService = inject(SnackbarService),
			categoryStore = inject(CategoryStore),
			translocoService = inject(TranslocoService),
		) => {
			function reload(transaction: Transaction): void {
				const newPages = {
					transactionPage: store.transactionPage(),
					incomePage: store.incomePage(),
					expensePage: store.expensePage(),
					recurringPage: store.recurringExpensePage(),
					recurringIncomePage: store.recurringIncomePage(),
					recurringExpensePage: store.recurringExpensePage(),
				};
				const newCaches = {
					transactions: store.transactions(),
					incomes: store.incomes(),
					expenses: store.expenses(),
					recurrings: store.recurrings(),
					recurringIncomes: store.recurringIncomes(),
					recurringExpenses: store.recurringExpenses(),
				};

				switch (transaction.type) {
					case TransactionType.INCOME:
						newPages.incomePage = 0;
						newCaches.incomes = {} as PagedResponse<Transaction>;
						store.incomeResource.reload();
						if (transaction.recurring) {
							newPages.recurringIncomePage = 0;
							newCaches.recurringIncomes = {} as PagedResponse<Transaction>;
							store.recurringIncomeResource.reload();
						}
						break;
					case TransactionType.EXPENSE:
						newPages.expensePage = 0;
						newCaches.expenses = {} as PagedResponse<Transaction>;
						store.expenseResource.reload();
						if (transaction.recurring) {
							newPages.recurringExpensePage = 0;
							newCaches.recurringExpenses = {} as PagedResponse<Transaction>;
							store.recurringExpenseResource.reload();
						}
						break;
				}
				newPages.transactionPage = 0;
				newCaches.transactions = {} as PagedResponse<Transaction>;
				store.transactionResource.reload();

				if (transaction.recurring) {
					newPages.recurringPage = 0;
					newCaches.recurrings = {} as PagedResponse<Transaction>;
					store.recurringResource.reload();
				}

				store.totalResource.reload();
				categoryStore.topCategoriesAllResource.reload();
				patchState(store, state => ({
					...state,
					...newPages,
					...newCaches,
				}));
			}

			function fullReload(): void {
				const newState: TransactionStoreData = {
					...initialState,
					filters: { ...(store.filters ? store.filters() : {}) } as TransactionFilter,
				};
				store.transactionResource.reload();
				store.incomeResource.reload();
				store.expenseResource.reload();
				store.totalResource.reload();
				store.recurringResource.reload();
				store.recurringIncomeResource.reload();
				store.recurringExpenseResource.reload();
				categoryStore.topCategoriesAllResource.reload();
				patchState(store, newState);
			}

			function formatTitle(title: string): string {
				const suffix = title.length > 10 ? '...' : '';
				return `${title.slice(0, 10)}${suffix}`;
			}

			return {
				async createTransaction(request: Transaction): Promise<void> {
					const newTransaction = await transactionService.create(request);
					snackbarService.showSuccess(
						translocoService.translate('transaction.create.successInfo', {
							title: formatTitle(newTransaction.title),
						}),
					);
					reload(request);
				},
				async updateTransaction(request: Transaction): Promise<void> {
					const updatedTransaction = await transactionService.update(request);
					snackbarService.showSuccess(
						translocoService.translate('transaction.updateInfo', {
							name: formatTitle(updatedTransaction.title),
						}),
					);
					fullReload();
				},
				async deleteTransaction(request: Transaction): Promise<void> {
					await transactionService.delete(request.id!);
					snackbarService.showSuccess(translocoService.translate('transaction.deleteInfo'));
					reload(request);
				},
				loadNextPage(type?: TransactionType, recurring?: boolean): void {
					const resourceMap = {
						[TransactionType.INCOME]: store.incomeResource,
						[TransactionType.EXPENSE]: store.expenseResource,
					};
					const recurringResourceMap = {
						[TransactionType.INCOME]: store.recurringIncomeResource,
						[TransactionType.EXPENSE]: store.recurringExpenseResource,
					};
					let res: ResourceRef<PagedResponse<Transaction> | undefined>;

					if (recurring) res = type ? recurringResourceMap[type] : store.recurringResource;
					else res = type ? resourceMap[type] : store.transactionResource;

					if (!res.isLoading() && !res.value()?.last) {
						patchState(store, state => {
							const pages = {
								transactionPage: state.transactionPage,
								incomePage: state.incomePage,
								expensePage: state.expensePage,
								recurringPage: state.recurringExpensePage,
								recurringIncomePage: state.recurringIncomePage,
								recurringExpensePage: state.recurringExpensePage,
							};
							if (recurring) {
								if (type === TransactionType.INCOME) pages.recurringIncomePage++;
								else if (type === TransactionType.EXPENSE) pages.recurringExpensePage++;
								else pages.recurringPage++;
							} else {
								if (type === TransactionType.INCOME) pages.incomePage++;
								else if (type === TransactionType.EXPENSE) pages.expensePage++;
								else pages.transactionPage++;
							}
							return { ...state, ...pages };
						});
					}
				},
				updateFilters(filters: TransactionFilter): void {
					if (JSON.stringify(store.filters?.()) === JSON.stringify(filters)) return;
					patchState(store, state => ({
						...state,
						filters: { ...filters },
						transactionPage: 0,
					}));
				},
				clearFilters(): void {
					const hasFilters = Object.keys(store.filters?.() ?? {}).length > 0;
					if (hasFilters || store.transactionPage() !== 0) {
						patchState(store, { filters: {} as TransactionFilter, transactionPage: 0 });
					}
				},
				resetState(): void {
					fullReload();
				},
			};
		},
	),

	withHooks({
		onInit(store): void {
			function merge(
				type: 'transactions' | 'incomes' | 'expenses' | 'recurrings' | 'recurringIncomes' | 'recurringExpenses', // keep in sync with TransactionStoreData data caches
				res: ResourceRef<PagedResponse<Transaction> | undefined>,
				page: number,
			): void {
				const val = res.value();
				if (val && !res.isLoading()) {
					patchState(store, state => {
						if (page === 0) return { [type]: val };
						return {
							[type]:
								page === 0
									? val
									: {
											...val,
											content: [...(state[type].content ?? []), ...val.content!],
										},
						};
					});
				}
			}

			effect(() => merge('transactions', store.transactionResource, store.transactionPage()));
			effect(() => merge('incomes', store.incomeResource, store.incomePage()));
			effect(() => merge('expenses', store.expenseResource, store.expensePage()));
			effect(() => merge('recurrings', store.recurringResource, store.recurringPage()));
			effect(() => merge('recurringIncomes', store.recurringIncomeResource, store.recurringIncomePage()));
			effect(() => merge('recurringExpenses', store.recurringExpenseResource, store.recurringExpensePage()));

			const currencyService = inject(CurrencyService);
			const baseCurrency = currencyService.baseCurrency;
			let previousCurrency = untracked(() => baseCurrency());

			effect(() => {
				const current = baseCurrency();
				if (current !== previousCurrency) {
					previousCurrency = current;
					untracked(() => store.resetState());
				}
			});
		},
	}),
);
