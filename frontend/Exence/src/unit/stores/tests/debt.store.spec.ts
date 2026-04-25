import { provideZonelessChangeDetection, signal, ɵEffectScheduler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { DebtCreate } from '../../../app/data-model/modules/debt/DebtCreate';
import { DebtGet } from '../../../app/data-model/modules/debt/DebtGet';
import { DebtPatch } from '../../../app/data-model/modules/debt/DebtPatch';
import { DebtPayment } from '../../../app/data-model/modules/debt/DebtPayment';
import { DebtStatus } from '../../../app/data-model/modules/debt/DebtStatus';
import { DebtType } from '../../../app/data-model/modules/debt/DebtType';
import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { DebtStore } from '../../../app/private/debts/debt.store';
import { DebtService } from '../../../app/private/debts/debt.service';
import { AchievementStore } from '../../../app/private/profile-dialog/achievements/achievement.store';
import { AuditLogStore } from '../../../app/shared/audit-log/audit-log.store';
import { CurrencyService } from '../../../app/shared/currency.service';
import { SnackbarService } from '../../../app/shared/snackbar/snackbar.service';
import { WorkspaceService } from '../../../app/shared/workspace.service';

// Fixtures
const mockDebt: DebtGet = {
	id: 1,
	title: 'Test Debt',
	counterpartyName: 'Alice',
	originalAmount: 1000,
	remainingAmount: 500,
	originalBaseCurrencyAmount: 1000,
	remainingBaseCurrencyAmount: 500,
	currency: SupportedCurrency.HUF,
	deadline: null,
	type: DebtType.LENT,
	status: DebtStatus.ACTIVE,
	categoryId: 1,
	paidPercentage: 50,
};

const createRequest: DebtCreate = {
	title: 'New Debt',
	counterpartyName: 'Bob',
	originalAmount: 500,
	currency: SupportedCurrency.HUF,
	type: DebtType.BORROWED,
	categoryId: 2,
};

const patchRequest: DebtPatch = { title: 'Updated Debt' };

const paymentRequest: DebtPayment = { amount: 200 };

// DebtStore
describe('DebtStore', () => {
	let store: InstanceType<typeof DebtStore>;
	let mockDebtService: jasmine.SpyObj<DebtService>;
	let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
	let mockTranslocoService: jasmine.SpyObj<TranslocoService>;

	beforeEach(() => {
		mockDebtService = jasmine.createSpyObj('DebtService', ['list', 'create', 'update', 'makePayment', 'delete']);
		mockDebtService.list.and.resolveTo([mockDebt]);
		mockDebtService.create.and.resolveTo(mockDebt);
		mockDebtService.update.and.resolveTo(mockDebt);
		mockDebtService.makePayment.and.resolveTo(mockDebt);
		mockDebtService.delete.and.resolveTo(undefined as unknown as void);

		mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess']);
		mockTranslocoService = jasmine.createSpyObj('TranslocoService', ['translate']);
		mockTranslocoService.translate.and.returnValue('translated message');

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				DebtStore,
				{ provide: DebtService, useValue: mockDebtService },
				{ provide: SnackbarService, useValue: mockSnackbarService },
				{ provide: TranslocoService, useValue: mockTranslocoService },
				{
					provide: AuditLogStore,
					useValue: {
						resetUser: jasmine.createSpy('resetUser'),
						resetAdmin: jasmine.createSpy('resetAdmin'),
					},
				},
				{ provide: AchievementStore, useValue: { reload: jasmine.createSpy('reload') } },
				{ provide: WorkspaceService, useValue: { currentWorkspace: signal(null).asReadonly() } },
				CurrencyService,
			],
		});

		store = TestBed.inject(DebtStore);
	});

	// Initial state
	describe('initial state', () => {
		it('starts with an empty debts array', () => {
			expect(store.debts()).toEqual([]);
		});
	});

	// createDebt
	describe('createDebt', () => {
		it('calls debtService.create with the request', async () => {
			await store.createDebt(createRequest);
			expect(mockDebtService.create).toHaveBeenCalledOnceWith(createRequest);
		});

		it('shows a success snackbar after creation', async () => {
			await store.createDebt(createRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads the debt resource after creation', async () => {
			spyOn(store.debtResource, 'reload');
			await store.createDebt(createRequest);
			expect(store.debtResource.reload).toHaveBeenCalled();
		});
	});

	// updateDebt
	describe('updateDebt', () => {
		it('calls debtService.update with id and patch', async () => {
			await store.updateDebt(1, patchRequest);
			expect(mockDebtService.update).toHaveBeenCalledOnceWith(1, patchRequest);
		});

		it('shows a success snackbar after update', async () => {
			await store.updateDebt(1, patchRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads the debt resource after update', async () => {
			spyOn(store.debtResource, 'reload');
			await store.updateDebt(1, patchRequest);
			expect(store.debtResource.reload).toHaveBeenCalled();
		});
	});

	// makePayment
	describe('makePayment', () => {
		it('calls debtService.makePayment with id and payment', async () => {
			await store.makePayment(1, paymentRequest);
			expect(mockDebtService.makePayment).toHaveBeenCalledOnceWith(1, paymentRequest);
		});

		it('shows a success snackbar after payment', async () => {
			await store.makePayment(1, paymentRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads the debt resource after payment', async () => {
			spyOn(store.debtResource, 'reload');
			await store.makePayment(1, paymentRequest);
			expect(store.debtResource.reload).toHaveBeenCalled();
		});
	});

	// deleteDebt
	describe('deleteDebt', () => {
		it('calls debtService.delete with the debt id', async () => {
			await store.deleteDebt(1);
			expect(mockDebtService.delete).toHaveBeenCalledOnceWith(1);
		});

		it('shows a success snackbar after deletion', async () => {
			await store.deleteDebt(1);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads the debt resource after deletion', async () => {
			spyOn(store.debtResource, 'reload');
			await store.deleteDebt(1);
			expect(store.debtResource.reload).toHaveBeenCalled();
		});
	});

	// resetState
	describe('resetState', () => {
		it('reloads the debt resource', () => {
			spyOn(store.debtResource, 'reload');
			store.resetState();
			expect(store.debtResource.reload).toHaveBeenCalled();
		});
	});

	// currency change effect
	describe('currency change effect', () => {
		it('reloads debtResource when baseCurrency changes to a new value', () => {
			spyOn(store.debtResource, 'reload');
			TestBed.inject(CurrencyService).setBaseCurrency(SupportedCurrency.EUR);
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.debtResource.reload).toHaveBeenCalled();
		});

		it('does not reload debtResource when currency has not changed', () => {
			spyOn(store.debtResource, 'reload');
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.debtResource.reload).not.toHaveBeenCalled();
		});
	});
});
