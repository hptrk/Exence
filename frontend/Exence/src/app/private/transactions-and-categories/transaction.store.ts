import { computed, effect, inject, resource, ResourceRef, untracked } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { TransactionCreate } from '../../data-model/modules/transaction/TransactionCreate';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionGet } from '../../data-model/modules/transaction/TransactionGet';
import { TransactionPatch } from '../../data-model/modules/transaction/TransactionPatch';
import { TransactionTotalsResponse } from '../../data-model/modules/transaction/TransactionTotalsResponse';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { CurrencyService } from '../../shared/currency.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { CategoryStore } from './category.store';
import { TransactionService } from './transaction.service';

export interface TransactionStoreData {
	// Page
	transactionPage: number;
	incomePage: number;
	expensePage: number;

	filters?: TransactionFilter;

	// Data caches
	transactions: PagedResponse<TransactionGet>;
	incomes: PagedResponse<TransactionGet>;
	expenses: PagedResponse<TransactionGet>;
}

const initialState: TransactionStoreData = {
	transactionPage: 0,
	incomePage: 0,
	expensePage: 0,

	filters: {} as TransactionFilter,

	transactions: {} as PagedResponse<TransactionGet>,
	incomes: {} as PagedResponse<TransactionGet>,
	expenses: {} as PagedResponse<TransactionGet>,
};

export const TransactionStore = signalStore(
	withState(initialState),

	withProps((store, transactionService = inject(TransactionService)) => ({
		transactionResource: resource<
			PagedResponse<TransactionGet>,
			{ page: number; filters?: TransactionFilter | undefined }
		>({
			params: () => ({ page: store.transactionPage(), filters: store.filters?.() }),
			loader: async ({ params }) => await transactionService.list(params.filters, params.page),
		}),
		incomeResource: resource<PagedResponse<TransactionGet>, { page: number }>({
			params: () => ({ page: store.incomePage() }),
			loader: async ({ params }) => await transactionService.listIncomes(params.page),
		}),
		expenseResource: resource<PagedResponse<TransactionGet>, { page: number }>({
			params: () => ({ page: store.expensePage() }),
			loader: async ({ params }) => await transactionService.listExpenses(params.page),
		}),
		totalResource: resource<TransactionTotalsResponse, undefined>({
			loader: async () => await transactionService.totals(),
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
			function reload(transaction: TransactionGet | TransactionCreate): void {
				const newPages = {
					transactionPage: store.transactionPage(),
					incomePage: store.incomePage(),
					expensePage: store.expensePage(),
				};
				const newCaches = {
					transactions: store.transactions(),
					incomes: store.incomes(),
					expenses: store.expenses(),
				};

				switch (transaction.type) {
					case TransactionType.INCOME:
						newPages.incomePage = 0;
						newCaches.incomes = {} as PagedResponse<TransactionGet>;
						store.incomeResource.reload();
						break;
					case TransactionType.EXPENSE:
						newPages.expensePage = 0;
						newCaches.expenses = {} as PagedResponse<TransactionGet>;
						store.expenseResource.reload();
						break;
				}
				newPages.transactionPage = 0;
				newCaches.transactions = {} as PagedResponse<TransactionGet>;
				store.transactionResource.reload();

				store.totalResource.reload();
				categoryStore.categoryResource.reload();
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
				categoryStore.categoryResource.reload();
				categoryStore.topCategoriesAllResource.reload();
				patchState(store, newState);
			}

			function formatTitle(title: string): string {
				const suffix = title.length > 10 ? '...' : '';
				return `${title.slice(0, 10)}${suffix}`;
			}

			return {
				async createTransaction(request: TransactionCreate): Promise<void> {
					const newTransaction = await transactionService.create(request);
					snackbarService.showSuccess(
						translocoService.translate('transaction.create.successInfo', {
							title: formatTitle(newTransaction.title),
						}),
					);
					reload(request);
				},
				async updateTransaction(transactionId: number, request: TransactionPatch): Promise<void> {
					const updatedTransaction = await transactionService.update(transactionId, request);
					snackbarService.showSuccess(
						translocoService.translate('transaction.updateInfo', {
							name: formatTitle(updatedTransaction.title),
						}),
					);
					fullReload();
				},
				async deleteTransaction(request: TransactionGet): Promise<void> {
					await transactionService.delete(request.id);
					snackbarService.showSuccess(translocoService.translate('transaction.deleteInfo'));
					reload(request);
				},
				loadNextPage(type?: TransactionType): void {
					const resourceMap = {
						[TransactionType.INCOME]: store.incomeResource,
						[TransactionType.EXPENSE]: store.expenseResource,
					};

					const res: ResourceRef<PagedResponse<TransactionGet> | undefined> = type
						? resourceMap[type]
						: store.transactionResource;

					if (!res.isLoading() && !res.value()?.last) {
						patchState(store, state => {
							const pages = {
								transactionPage: state.transactionPage,
								incomePage: state.incomePage,
								expensePage: state.expensePage,
							};
							if (type === TransactionType.INCOME) pages.incomePage++;
							else if (type === TransactionType.EXPENSE) pages.expensePage++;
							else pages.transactionPage++;
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
				type: 'transactions' | 'incomes' | 'expenses',
				res: ResourceRef<PagedResponse<TransactionGet> | undefined>,
				page: number,
			): void {
				const val = res.value();
				if (val && !res.isLoading()) {
					patchState(store, state => {
						if (page === 0) return { [type]: val };
						return {
							[type]: {
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
