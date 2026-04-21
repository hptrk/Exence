import { provideZonelessChangeDetection, ɵEffectScheduler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { PagedResponse } from '../../../app/data-model/modules/common/PagedResponse';
import { TransactionCreate } from '../../../app/data-model/modules/transaction/TransactionCreate';
import { TransactionGet } from '../../../app/data-model/modules/transaction/TransactionGet';
import { TransactionPatch } from '../../../app/data-model/modules/transaction/TransactionPatch';
import { TransactionTotalsResponse } from '../../../app/data-model/modules/transaction/TransactionTotalsResponse';
import { TransactionType } from '../../../app/data-model/modules/transaction/TransactionType';
import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { TransactionStore } from '../../../app/private/transactions-and-categories/transaction.store';
import { CategoryStore } from '../../../app/private/transactions-and-categories/category.store';
import { TransactionService } from '../../../app/private/transactions-and-categories/transaction.service';
import { CurrencyService } from '../../../app/shared/currency.service';
import { SnackbarService } from '../../../app/shared/snackbar/snackbar.service';

// Fixtures
const emptyPage: PagedResponse<TransactionGet> = {
	content: [],
	page: 0,
	size: 20,
	totalElements: 0,
	totalPages: 1,
	first: true,
	last: true,
	numberOfElements: 0,
};

const notLastPage: PagedResponse<TransactionGet> = { ...emptyPage, last: false };

const mockTotals: TransactionTotalsResponse = { totalIncome: 3000, totalExpense: 1500 };

const mockTransaction: TransactionGet = {
	id: 1,
	title: 'Salary',
	date: '2026-01-15',
	amount: 3000,
	type: TransactionType.INCOME,
	createdByRecurringJob: false,
	categoryId: 1,
	currency: SupportedCurrency.HUF,
	exchangeRate: 1,
	baseCurrencyAmount: 3000,
};

const expenseTransaction: TransactionGet = {
	...mockTransaction,
	id: 2,
	type: TransactionType.EXPENSE,
	title: 'Rent',
	amount: 800,
};

const createIncomeRequest: TransactionCreate = {
	title: 'Bonus',
	date: '2026-02-01',
	amount: 1000,
	type: TransactionType.INCOME,
	categoryId: 1,
	currency: SupportedCurrency.HUF,
	exchangeRate: 1,
};

const createExpenseRequest: TransactionCreate = {
	...createIncomeRequest,
	type: TransactionType.EXPENSE,
	title: 'Groceries',
};

const patchRequest: TransactionPatch = { title: 'Updated Transaction' };

// TransactionStore
describe('TransactionStore', () => {
	let store: InstanceType<typeof TransactionStore>;
	let mockTransactionService: jasmine.SpyObj<TransactionService>;
	let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
	let mockTranslocoService: jasmine.SpyObj<TranslocoService>;
	let mockCategoryStore: {
		categoryResource: { reload: jasmine.Spy };
		topCategoriesAllResource: { reload: jasmine.Spy };
	};

	beforeEach(() => {
		mockTransactionService = jasmine.createSpyObj('TransactionService', [
			'list',
			'listIncomes',
			'listExpenses',
			'totals',
			'create',
			'update',
			'delete',
		]);
		mockTransactionService.list.and.resolveTo(emptyPage);
		mockTransactionService.listIncomes.and.resolveTo(emptyPage);
		mockTransactionService.listExpenses.and.resolveTo(emptyPage);
		mockTransactionService.totals.and.resolveTo(mockTotals);
		mockTransactionService.create.and.resolveTo(mockTransaction);
		mockTransactionService.update.and.resolveTo(mockTransaction);
		mockTransactionService.delete.and.resolveTo(undefined as unknown as void);

		mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess']);
		mockTranslocoService = jasmine.createSpyObj('TranslocoService', ['translate']);
		mockTranslocoService.translate.and.returnValue('translated message');

		mockCategoryStore = {
			categoryResource: { reload: jasmine.createSpy('reload') },
			topCategoriesAllResource: { reload: jasmine.createSpy('reload') },
		};

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				TransactionStore,
				{ provide: TransactionService, useValue: mockTransactionService },
				{ provide: SnackbarService, useValue: mockSnackbarService },
				{ provide: TranslocoService, useValue: mockTranslocoService },
				{ provide: CategoryStore, useValue: mockCategoryStore },
				CurrencyService,
			],
		});

		store = TestBed.inject(TransactionStore);
	});

	// Initial state
	describe('initial state', () => {
		it('transactionPage starts at 0', () => {
			expect(store.transactionPage()).toBe(0);
		});

		it('incomePage starts at 0', () => {
			expect(store.incomePage()).toBe(0);
		});

		it('expensePage starts at 0', () => {
			expect(store.expensePage()).toBe(0);
		});

		it('filters starts as an empty object', () => {
			expect(store.filters?.()).toEqual({});
		});

		it('totalIncome defaults to 0 before resource loads', () => {
			expect(store.totalIncome()).toBe(0);
		});

		it('totalExpense defaults to 0 before resource loads', () => {
			expect(store.totalExpense()).toBe(0);
		});

		it('balance defaults to 0 before resource loads', () => {
			expect(store.balance()).toBe(0);
		});
	});

	// createTransaction - INCOME type
	describe('createTransaction (INCOME)', () => {
		it('calls transactionService.create with the request', async () => {
			await store.createTransaction(createIncomeRequest);
			expect(mockTransactionService.create).toHaveBeenCalledOnceWith(createIncomeRequest);
		});

		it('shows a success snackbar', async () => {
			await store.createTransaction(createIncomeRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads transactionResource and totalResource', async () => {
			spyOn(store.transactionResource, 'reload');
			spyOn(store.totalResource, 'reload');
			await store.createTransaction(createIncomeRequest);
			expect(store.transactionResource.reload).toHaveBeenCalled();
			expect(store.totalResource.reload).toHaveBeenCalled();
		});

		it('reloads incomeResource for INCOME type', async () => {
			spyOn(store.incomeResource, 'reload');
			await store.createTransaction(createIncomeRequest);
			expect(store.incomeResource.reload).toHaveBeenCalled();
		});

		it('does not reload expenseResource for INCOME type', async () => {
			spyOn(store.expenseResource, 'reload');
			await store.createTransaction(createIncomeRequest);
			expect(store.expenseResource.reload).not.toHaveBeenCalled();
		});

		it('resets transactionPage and incomePage to 0', async () => {
			await store.createTransaction(createIncomeRequest);
			expect(store.transactionPage()).toBe(0);
			expect(store.incomePage()).toBe(0);
		});
	});

	// createTransaction - EXPENSE type
	describe('createTransaction (EXPENSE)', () => {
		it('reloads expenseResource for EXPENSE type', async () => {
			spyOn(store.expenseResource, 'reload');
			await store.createTransaction(createExpenseRequest);
			expect(store.expenseResource.reload).toHaveBeenCalled();
		});

		it('does not reload incomeResource for EXPENSE type', async () => {
			spyOn(store.incomeResource, 'reload');
			await store.createTransaction(createExpenseRequest);
			expect(store.incomeResource.reload).not.toHaveBeenCalled();
		});

		it('resets transactionPage and expensePage to 0', async () => {
			await store.createTransaction(createExpenseRequest);
			expect(store.transactionPage()).toBe(0);
			expect(store.expensePage()).toBe(0);
		});
	});

	// updateTransaction
	describe('updateTransaction', () => {
		it('calls transactionService.update with id and patch', async () => {
			await store.updateTransaction(1, patchRequest);
			expect(mockTransactionService.update).toHaveBeenCalledOnceWith(1, patchRequest);
		});

		it('shows a success snackbar', async () => {
			await store.updateTransaction(1, patchRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads all resources after full reload', async () => {
			spyOn(store.transactionResource, 'reload');
			spyOn(store.incomeResource, 'reload');
			spyOn(store.expenseResource, 'reload');
			spyOn(store.totalResource, 'reload');
			await store.updateTransaction(1, patchRequest);
			expect(store.transactionResource.reload).toHaveBeenCalled();
			expect(store.incomeResource.reload).toHaveBeenCalled();
			expect(store.expenseResource.reload).toHaveBeenCalled();
			expect(store.totalResource.reload).toHaveBeenCalled();
		});

		it('resets all pages to 0', async () => {
			await store.updateTransaction(1, patchRequest);
			expect(store.transactionPage()).toBe(0);
			expect(store.incomePage()).toBe(0);
			expect(store.expensePage()).toBe(0);
		});
	});

	// deleteTransaction
	describe('deleteTransaction', () => {
		it('calls transactionService.delete with the transaction id', async () => {
			await store.deleteTransaction(mockTransaction);
			expect(mockTransactionService.delete).toHaveBeenCalledOnceWith(mockTransaction.id);
		});

		it('shows a success snackbar', async () => {
			await store.deleteTransaction(mockTransaction);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads transactionResource', async () => {
			spyOn(store.transactionResource, 'reload');
			await store.deleteTransaction(mockTransaction);
			expect(store.transactionResource.reload).toHaveBeenCalled();
		});

		it('reloads incomeResource when deleting an income', async () => {
			spyOn(store.incomeResource, 'reload');
			await store.deleteTransaction(mockTransaction);
			expect(store.incomeResource.reload).toHaveBeenCalled();
		});

		it('reloads expenseResource when deleting an expense', async () => {
			spyOn(store.expenseResource, 'reload');
			await store.deleteTransaction(expenseTransaction);
			expect(store.expenseResource.reload).toHaveBeenCalled();
		});

		it('does not reload expenseResource when deleting an income', async () => {
			spyOn(store.expenseResource, 'reload');
			await store.deleteTransaction(mockTransaction);
			expect(store.expenseResource.reload).not.toHaveBeenCalled();
		});
	});

	// loadNextPage
	describe('loadNextPage', () => {
		async function waitForResources(): Promise<void> {
			await new Promise(resolve => setTimeout(resolve, 0));
			TestBed.flushEffects();
		}

		it('increments transactionPage when resource is not on last page', async () => {
			mockTransactionService.list.and.resolveTo(notLastPage);
			store.transactionResource.reload();
			await waitForResources();
			store.loadNextPage();
			expect(store.transactionPage()).toBe(1);
		});

		it('increments incomePage when called with INCOME', async () => {
			mockTransactionService.listIncomes.and.resolveTo(notLastPage);
			store.incomeResource.reload();
			await waitForResources();
			store.loadNextPage(TransactionType.INCOME);
			expect(store.incomePage()).toBe(1);
		});

		it('increments expensePage when called with EXPENSE', async () => {
			mockTransactionService.listExpenses.and.resolveTo(notLastPage);
			store.expenseResource.reload();
			await waitForResources();
			store.loadNextPage(TransactionType.EXPENSE);
			expect(store.expensePage()).toBe(1);
		});

		it('is a no-op when transactionResource is on last page', async () => {
			// Default emptyPage has last: true; wait for it to load and confirm no-op
			await waitForResources();
			store.loadNextPage();
			expect(store.transactionPage()).toBe(0);
		});
	});

	// updateFilters
	describe('updateFilters', () => {
		it('patches filters and resets transactionPage to 0', () => {
			const newFilters = { amountFrom: 100 };
			store.updateFilters(newFilters as never);
			expect(store.filters?.()).toEqual(newFilters);
			expect(store.transactionPage()).toBe(0);
		});

		it('is a no-op when filters are unchanged', () => {
			const filters = { amountFrom: 100 };
			store.updateFilters(filters as never);
			const callCount = mockTransactionService.list.calls.count();
			store.updateFilters(filters as never);
			expect(mockTransactionService.list.calls.count()).toBe(callCount);
		});
	});

	// clearFilters
	describe('clearFilters', () => {
		it('resets filters to empty object when filters exist', () => {
			store.updateFilters({ amountFrom: 100 } as never);
			store.clearFilters();
			expect(store.filters?.()).toEqual({});
			expect(store.transactionPage()).toBe(0);
		});

		it('is a no-op when filters are already empty and page is 0', () => {
			const initialPage = store.transactionPage();
			store.clearFilters();
			expect(store.transactionPage()).toBe(initialPage);
		});
	});

	// currency change effect
	describe('currency change effect', () => {
		it('reloads transactionResource when baseCurrency changes to a new value', () => {
			spyOn(store.transactionResource, 'reload');
			TestBed.inject(CurrencyService).setBaseCurrency(SupportedCurrency.EUR);
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.transactionResource.reload).toHaveBeenCalled();
		});

		it('does not reload transactionResource when currency has not changed', () => {
			spyOn(store.transactionResource, 'reload');
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.transactionResource.reload).not.toHaveBeenCalled();
		});
	});
});
