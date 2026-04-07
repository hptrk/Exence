import { effect, inject, resource, ResourceRef, untracked } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { PagedResponse } from '../../data-model/modules/common/PagedResponse';
import { RecurringTransactionGet } from '../../data-model/modules/transaction/RecurringTransactionGet';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { RecurringService } from './recurring.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { CategoryStore } from './category.store';
import { TranslocoService } from '@jsverse/transloco';
import { RecurringTransactionCreate } from '../../data-model/modules/transaction/RecurringTransactionCreate';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';
import { RecurringTransactionPatch } from '../../data-model/modules/transaction/RecurringTransactionPatch';
import { CurrencyService } from '../../shared/currency.service';

export interface RecurringTransactionStoreDate {
	// Page
	transactionPage: number;
	incomePage: number;
	expensePage: number;

	filters?: TransactionFilter;

	transactions: PagedResponse<RecurringTransactionGet>;
	incomes: PagedResponse<RecurringTransactionGet>;
	expenses: PagedResponse<RecurringTransactionGet>;
}

const initialState: RecurringTransactionStoreDate = {
	transactionPage: 0,
	incomePage: 0,
	expensePage: 0,

	filters: {} as TransactionFilter,

	transactions: {} as PagedResponse<RecurringTransactionGet>,
	incomes: {} as PagedResponse<RecurringTransactionGet>,
	expenses: {} as PagedResponse<RecurringTransactionGet>,
};

export const RecurringStore = signalStore(
	withState(initialState),

	withProps((store, recurringService = inject(RecurringService)) => ({
		transactionResource: resource<
			PagedResponse<RecurringTransactionGet>,
			{ page: number; filters?: TransactionFilter | undefined }
		>({
			params: () => ({ page: store.transactionPage(), filters: store.filters ? store.filters() : undefined }),
			loader: async ({ params }) => await recurringService.list(params.filters, params.page),
		}),
		incomeResource: resource<PagedResponse<RecurringTransactionGet>, { page: number }>({
			params: () => ({ page: store.incomePage() }),
			loader: async ({ params }) => await recurringService.listIncomes(params.page),
		}),
		expenseResource: resource<PagedResponse<RecurringTransactionGet>, { page: number }>({
			params: () => ({ page: store.expensePage() }),
			loader: async ({ params }) => await recurringService.listExpenses(params.page),
		}),
	})),

	withMethods(
		(
			store,
			recurringService = inject(RecurringService),
			snackbarService = inject(SnackbarService),
			categoryStore = inject(CategoryStore),
			translocoService = inject(TranslocoService),
		) => {
			function reload(transaction: RecurringTransactionGet | RecurringTransactionCreate): void {
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
						newPages.incomePage = initialState.incomePage;
						newCaches.incomes = initialState.incomes;
						store.incomeResource.reload();
						break;
					case TransactionType.EXPENSE:
						newPages.expensePage = initialState.expensePage;
						newCaches.expenses = initialState.expenses;
						store.expenseResource.reload();
						break;
				}
				newPages.transactionPage = initialState.transactionPage;
				newCaches.transactions = initialState.transactions;
				store.transactionResource.reload();

				categoryStore.topCategoriesAllResource.reload();
				patchState(store, state => ({
					...state,
					...newPages,
					...newCaches,
				}));
			}

			function fullReload(): void {
				const newState: RecurringTransactionStoreDate = {
					...initialState,
					filters: { ...(store.filters ? store.filters() : {}) } as TransactionFilter,
				};
				store.transactionResource.reload();
				store.incomeResource.reload();
				store.expenseResource.reload();
				categoryStore.topCategoriesAllResource.reload();
				patchState(store, newState);
			}

			function formatTitle(title: string): string {
				const suffix = title.length > 10 ? '...' : '';
				return `${title.slice(0, 10)}${suffix}`;
			}
			return {
				async createRecurringTransaction(request: RecurringTransactionCreate): Promise<void> {
					const newTransaction = await recurringService.create(request);
					snackbarService.showSuccess(
						translocoService.translate('transaction.create.successInfo', {
							title: formatTitle(newTransaction.title),
						}),
					);
					reload(request);
				},
				async updateRecurringTransaction(id: number, request: RecurringTransactionPatch): Promise<void> {
					const updatedTransaction = await recurringService.update(id, request);
					snackbarService.showSuccess(
						translocoService.translate('transaction.updateInfo', {
							name: formatTitle(updatedTransaction.title),
						}),
					);
					fullReload();
				},
				async deleteRecurringTransaction(request: RecurringTransactionGet): Promise<void> {
					await recurringService.delete(request.id);
					snackbarService.showSuccess(translocoService.translate('transaction.deleteInfo'));
					reload(request);
				},
				loadNextPage(type?: TransactionType): void {
					const resourceMap = {
						[TransactionType.INCOME]: store.incomeResource,
						[TransactionType.EXPENSE]: store.expenseResource,
					};

					const res: ResourceRef<PagedResponse<RecurringTransactionGet> | undefined> = type
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
				res: ResourceRef<PagedResponse<RecurringTransactionGet> | undefined>,
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
