import { provideZonelessChangeDetection, signal, ɵEffectScheduler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { PagedResponse } from '../../../app/data-model/modules/common/PagedResponse';
import { EndCondition } from '../../../app/data-model/modules/transaction/EndCondition';
import { RecurrenceFrequency } from '../../../app/data-model/modules/transaction/RecurrenceFrequency';
import { RecurringTransactionCreate } from '../../../app/data-model/modules/transaction/RecurringTransactionCreate';
import { RecurringTransactionGet } from '../../../app/data-model/modules/transaction/RecurringTransactionGet';
import { RecurringTransactionPatch } from '../../../app/data-model/modules/transaction/RecurringTransactionPatch';
import { TransactionType } from '../../../app/data-model/modules/transaction/TransactionType';
import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { RecurringStore } from '../../../app/private/transactions-and-categories/recurring.store';
import { CategoryStore } from '../../../app/private/transactions-and-categories/category.store';
import { RecurringService } from '../../../app/private/transactions-and-categories/recurring.service';
import { AuditLogStore } from '../../../app/shared/audit-log/audit-log.store';
import { CurrencyService } from '../../../app/shared/currency.service';
import { SnackbarService } from '../../../app/shared/snackbar/snackbar.service';
import { WorkspaceService } from '../../../app/shared/workspace.service';

// Fixtures
const emptyPage: PagedResponse<RecurringTransactionGet> = {
	content: [],
	page: 0,
	size: 20,
	totalElements: 0,
	totalPages: 1,
	first: true,
	last: true,
	numberOfElements: 0,
};

const mockRecurring: RecurringTransactionGet = {
	id: 1,
	title: 'Monthly Rent',
	amount: 800,
	type: TransactionType.EXPENSE,
	categoryId: 1,
	currency: SupportedCurrency.HUF,
	frequency: RecurrenceFrequency.MONTHLY,
	interval: 1,
	endCondition: EndCondition.NEVER,
	currentOccurrences: 3,
	active: true,
};

const createRequest: RecurringTransactionCreate = {
	title: 'Weekly Groceries',
	amount: 100,
	type: TransactionType.EXPENSE,
	categoryId: 1,
	currency: SupportedCurrency.HUF,
	frequency: RecurrenceFrequency.WEEKLY,
	interval: 1,
	endCondition: EndCondition.NEVER,
	startDate: '2026-01-01',
};

const incomeCreateRequest: RecurringTransactionCreate = {
	...createRequest,
	type: TransactionType.INCOME,
};

const patchRequest: RecurringTransactionPatch = { title: 'Updated Recurring' };

// RecurringStore
describe('RecurringStore', () => {
	let store: InstanceType<typeof RecurringStore>;
	let mockRecurringService: jasmine.SpyObj<RecurringService>;
	let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
	let mockTranslocoService: jasmine.SpyObj<TranslocoService>;
	let mockCategoryStore: { topCategoriesAllResource: { reload: jasmine.Spy } };

	beforeEach(() => {
		mockRecurringService = jasmine.createSpyObj('RecurringService', [
			'list',
			'listIncomes',
			'listExpenses',
			'create',
			'update',
			'delete',
		]);
		mockRecurringService.list.and.resolveTo(emptyPage);
		mockRecurringService.listIncomes.and.resolveTo(emptyPage);
		mockRecurringService.listExpenses.and.resolveTo(emptyPage);
		mockRecurringService.create.and.resolveTo(mockRecurring);
		mockRecurringService.update.and.resolveTo(mockRecurring);
		mockRecurringService.delete.and.resolveTo(undefined as unknown as void);

		mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess']);
		mockTranslocoService = jasmine.createSpyObj('TranslocoService', ['translate']);
		mockTranslocoService.translate.and.returnValue('translated message');

		mockCategoryStore = {
			topCategoriesAllResource: { reload: jasmine.createSpy('reload') },
		};

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				RecurringStore,
				{ provide: RecurringService, useValue: mockRecurringService },
				{ provide: SnackbarService, useValue: mockSnackbarService },
				{ provide: TranslocoService, useValue: mockTranslocoService },
				{ provide: CategoryStore, useValue: mockCategoryStore },
				{
					provide: AuditLogStore,
					useValue: {
						resetUser: jasmine.createSpy('resetUser'),
						resetAdmin: jasmine.createSpy('resetAdmin'),
					},
				},
				{ provide: WorkspaceService, useValue: { currentWorkspace: signal(null).asReadonly() } },
				CurrencyService,
			],
		});

		store = TestBed.inject(RecurringStore);
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
	});

	// createRecurringTransaction
	describe('createRecurringTransaction', () => {
		it('calls recurringService.create with the request', async () => {
			await store.createRecurringTransaction(createRequest);
			expect(mockRecurringService.create).toHaveBeenCalledOnceWith(createRequest);
		});

		it('shows a success snackbar after creation', async () => {
			await store.createRecurringTransaction(createRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads transactionResource after creation', async () => {
			spyOn(store.transactionResource, 'reload');
			await store.createRecurringTransaction(createRequest);
			expect(store.transactionResource.reload).toHaveBeenCalled();
		});

		it('reloads incomeResource for INCOME type', async () => {
			spyOn(store.incomeResource, 'reload');
			await store.createRecurringTransaction(incomeCreateRequest);
			expect(store.incomeResource.reload).toHaveBeenCalled();
		});

		it('reloads expenseResource for EXPENSE type', async () => {
			spyOn(store.expenseResource, 'reload');
			await store.createRecurringTransaction(createRequest);
			expect(store.expenseResource.reload).toHaveBeenCalled();
		});

		it('resets transactionPage to 0 after creation', async () => {
			await store.createRecurringTransaction(createRequest);
			expect(store.transactionPage()).toBe(0);
		});
	});

	// updateRecurringTransaction
	describe('updateRecurringTransaction', () => {
		it('calls recurringService.update with id and patch', async () => {
			await store.updateRecurringTransaction(1, patchRequest);
			expect(mockRecurringService.update).toHaveBeenCalledOnceWith(1, patchRequest);
		});

		it('shows a success snackbar after update', async () => {
			await store.updateRecurringTransaction(1, patchRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads all resources after update', async () => {
			spyOn(store.transactionResource, 'reload');
			spyOn(store.incomeResource, 'reload');
			spyOn(store.expenseResource, 'reload');
			await store.updateRecurringTransaction(1, patchRequest);
			expect(store.transactionResource.reload).toHaveBeenCalled();
			expect(store.incomeResource.reload).toHaveBeenCalled();
			expect(store.expenseResource.reload).toHaveBeenCalled();
		});

		it('resets all pages to 0 after full reload', async () => {
			await store.updateRecurringTransaction(1, patchRequest);
			expect(store.transactionPage()).toBe(0);
			expect(store.incomePage()).toBe(0);
			expect(store.expensePage()).toBe(0);
		});
	});

	// deleteRecurringTransaction
	describe('deleteRecurringTransaction', () => {
		it('calls recurringService.delete with the transaction id', async () => {
			await store.deleteRecurringTransaction(mockRecurring);
			expect(mockRecurringService.delete).toHaveBeenCalledOnceWith(mockRecurring.id);
		});

		it('shows a success snackbar after deletion', async () => {
			await store.deleteRecurringTransaction(mockRecurring);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads transactionResource after deletion', async () => {
			spyOn(store.transactionResource, 'reload');
			await store.deleteRecurringTransaction(mockRecurring);
			expect(store.transactionResource.reload).toHaveBeenCalled();
		});
	});

	// loadNextPage
	describe('loadNextPage', () => {
		async function waitForResources(): Promise<void> {
			await new Promise(resolve => setTimeout(resolve, 0));
			TestBed.flushEffects();
		}

		it('increments transactionPage when resource is not on last page', async () => {
			mockRecurringService.list.and.resolveTo({ ...emptyPage, last: false });
			store.transactionResource.reload();
			await waitForResources();
			store.loadNextPage();
			expect(store.transactionPage()).toBe(1);
		});

		it('increments incomePage when called with INCOME', async () => {
			mockRecurringService.listIncomes.and.resolveTo({ ...emptyPage, last: false });
			store.incomeResource.reload();
			await waitForResources();
			store.loadNextPage(TransactionType.INCOME);
			expect(store.incomePage()).toBe(1);
		});

		it('increments expensePage when called with EXPENSE', async () => {
			mockRecurringService.listExpenses.and.resolveTo({ ...emptyPage, last: false });
			store.expenseResource.reload();
			await waitForResources();
			store.loadNextPage(TransactionType.EXPENSE);
			expect(store.expensePage()).toBe(1);
		});

		it('is a no-op when transactionResource is on last page', async () => {
			// Default emptyPage has last: true; wait for initial load to finish
			await waitForResources();
			store.loadNextPage();
			expect(store.transactionPage()).toBe(0);
		});

		it('appends page 1 content after page 0 content in transactions state', async () => {
			const page0Items: RecurringTransactionGet[] = [{ ...mockRecurring, id: 101 }];
			const page1Items: RecurringTransactionGet[] = [{ ...mockRecurring, id: 201 }];
			const page0: PagedResponse<RecurringTransactionGet> = {
				...emptyPage,
				content: page0Items,
				last: false,
				page: 0,
			};
			const page1: PagedResponse<RecurringTransactionGet> = {
				...emptyPage,
				content: page1Items,
				last: true,
				page: 1,
			};

			mockRecurringService.list.and.resolveTo(page0);
			store.transactionResource.reload();
			await waitForResources();
			expect(store.transactions().content).toEqual(page0Items);

			mockRecurringService.list.and.resolveTo(page1);
			store.loadNextPage();
			await waitForResources();

			expect(store.transactions().content).toEqual([...page0Items, ...page1Items]);
		});

		it('appends page 1 content after page 0 content in income state', async () => {
			const page0Items: RecurringTransactionGet[] = [{ ...mockRecurring, id: 301 }];
			const page1Items: RecurringTransactionGet[] = [{ ...mockRecurring, id: 401 }];
			const page0: PagedResponse<RecurringTransactionGet> = {
				...emptyPage,
				content: page0Items,
				last: false,
				page: 0,
			};
			const page1: PagedResponse<RecurringTransactionGet> = {
				...emptyPage,
				content: page1Items,
				last: true,
				page: 1,
			};

			mockRecurringService.listIncomes.and.resolveTo(page0);
			store.incomeResource.reload();
			await waitForResources();
			expect(store.incomes().content).toEqual(page0Items);

			mockRecurringService.listIncomes.and.resolveTo(page1);
			store.loadNextPage(TransactionType.INCOME);
			await waitForResources();

			expect(store.incomes().content).toEqual([...page0Items, ...page1Items]);
		});

		it('appends page 1 content after page 0 content in expense state', async () => {
			const page0Items: RecurringTransactionGet[] = [{ ...mockRecurring, id: 501 }];
			const page1Items: RecurringTransactionGet[] = [{ ...mockRecurring, id: 601 }];
			const page0: PagedResponse<RecurringTransactionGet> = {
				...emptyPage,
				content: page0Items,
				last: false,
				page: 0,
			};
			const page1: PagedResponse<RecurringTransactionGet> = {
				...emptyPage,
				content: page1Items,
				last: true,
				page: 1,
			};

			mockRecurringService.listExpenses.and.resolveTo(page0);
			store.expenseResource.reload();
			await waitForResources();
			expect(store.expenses().content).toEqual(page0Items);

			mockRecurringService.listExpenses.and.resolveTo(page1);
			store.loadNextPage(TransactionType.EXPENSE);
			await waitForResources();

			expect(store.expenses().content).toEqual([...page0Items, ...page1Items]);
		});
	});

	// resetState
	describe('resetState', () => {
		it('reloads all resources', () => {
			spyOn(store.transactionResource, 'reload');
			spyOn(store.incomeResource, 'reload');
			spyOn(store.expenseResource, 'reload');
			store.resetState();
			expect(store.transactionResource.reload).toHaveBeenCalled();
			expect(store.incomeResource.reload).toHaveBeenCalled();
			expect(store.expenseResource.reload).toHaveBeenCalled();
		});

		it('resets all pages to initial state', () => {
			store.resetState();
			expect(store.transactionPage()).toBe(0);
			expect(store.incomePage()).toBe(0);
			expect(store.expensePage()).toBe(0);
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
