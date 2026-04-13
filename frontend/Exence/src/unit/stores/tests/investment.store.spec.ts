import { provideZonelessChangeDetection, ɵEffectScheduler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { InvestmentCreate } from '../../../app/data-model/modules/investment/InvestmentCreate';
import { InvestmentGet } from '../../../app/data-model/modules/investment/InvestmentGet';
import { InvestmentGroup } from '../../../app/data-model/modules/investment/InvestmentGroup';
import { InvestmentPatch } from '../../../app/data-model/modules/investment/InvestmentPatch';
import { InvestmentType } from '../../../app/data-model/modules/investment/InvestmentType';
import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { InvestmentStore } from '../../../app/private/investments/investment.store';
import { InvestmentService } from '../../../app/private/investments/investment.service';
import { CurrencyService } from '../../../app/shared/currency.service';
import { SnackbarService } from '../../../app/shared/snackbar/snackbar.service';

// Fixtures
const mockInvestmentGroup: InvestmentGroup = {
	name: 'AAPL',
	daysSinceLastAction: 10,
	totalInvested: 5000,
	type: InvestmentType.STOCK,
	purchasesCount: 2,
	purchases: [],
};

const createRequest: InvestmentCreate = {
	asset: 'MSFT',
	purchaseDate: '2026-01-15',
	type: InvestmentType.STOCK,
	amount: 1000,
	currency: SupportedCurrency.USD,
};

const patchRequest: InvestmentPatch = { amount: 1500 };

const mockInvestmentGet: InvestmentGet = {
	id: 10,
	asset: 'MSFT',
	purchaseDate: '2026-01-15',
	type: InvestmentType.STOCK,
	amount: 1000,
	currency: SupportedCurrency.USD,
	baseCurrencyAmount: 400000,
	note: null,
};

// InvestmentStore
describe('InvestmentStore', () => {
	let store: InstanceType<typeof InvestmentStore>;
	let mockInvestmentService: jasmine.SpyObj<InvestmentService>;
	let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
	let mockTranslocoService: jasmine.SpyObj<TranslocoService>;

	beforeEach(() => {
		mockInvestmentService = jasmine.createSpyObj('InvestmentService', [
			'getGroupedInvestments',
			'create',
			'update',
			'delete',
		]);
		mockInvestmentService.getGroupedInvestments.and.resolveTo([mockInvestmentGroup]);
		mockInvestmentService.create.and.resolveTo(mockInvestmentGet);
		mockInvestmentService.update.and.resolveTo(mockInvestmentGet);
		mockInvestmentService.delete.and.resolveTo(undefined as unknown as void);

		mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess']);
		mockTranslocoService = jasmine.createSpyObj('TranslocoService', ['translate']);
		mockTranslocoService.translate.and.returnValue('translated message');

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				InvestmentStore,
				{ provide: InvestmentService, useValue: mockInvestmentService },
				{ provide: SnackbarService, useValue: mockSnackbarService },
				{ provide: TranslocoService, useValue: mockTranslocoService },
				CurrencyService,
			],
		});

		store = TestBed.inject(InvestmentStore);
	});

	// Initial state
	describe('initial state', () => {
		it('starts with an empty investments array', () => {
			expect(store.investments()).toEqual([]);
		});
	});

	// createInvestment
	describe('createInvestment', () => {
		it('calls investmentService.create with the request', async () => {
			await store.createInvestment(createRequest);
			expect(mockInvestmentService.create).toHaveBeenCalledOnceWith(createRequest);
		});

		it('shows a success snackbar after creation', async () => {
			await store.createInvestment(createRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads the investment resource after creation', async () => {
			spyOn(store.investmentResource, 'reload');
			await store.createInvestment(createRequest);
			expect(store.investmentResource.reload).toHaveBeenCalled();
		});
	});

	// updateInvestment
	describe('updateInvestment', () => {
		it('calls investmentService.update with id and patch', async () => {
			await store.updateInvestment(1, patchRequest);
			expect(mockInvestmentService.update).toHaveBeenCalledOnceWith(1, patchRequest);
		});

		it('shows a success snackbar after update', async () => {
			await store.updateInvestment(1, patchRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads the investment resource after update', async () => {
			spyOn(store.investmentResource, 'reload');
			await store.updateInvestment(1, patchRequest);
			expect(store.investmentResource.reload).toHaveBeenCalled();
		});
	});

	// deleteInvestment
	describe('deleteInvestment', () => {
		it('calls investmentService.delete with the investment id', async () => {
			await store.deleteInvestment(1);
			expect(mockInvestmentService.delete).toHaveBeenCalledOnceWith(1);
		});

		it('shows a success snackbar after deletion', async () => {
			await store.deleteInvestment(1);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads the investment resource after deletion', async () => {
			spyOn(store.investmentResource, 'reload');
			await store.deleteInvestment(1);
			expect(store.investmentResource.reload).toHaveBeenCalled();
		});
	});

	// resetState
	describe('resetState', () => {
		it('reloads the investment resource', () => {
			spyOn(store.investmentResource, 'reload');
			store.resetState();
			expect(store.investmentResource.reload).toHaveBeenCalled();
		});
	});

	// currency change effect
	describe('currency change effect', () => {
		it('reloads investmentResource when baseCurrency changes to a new value', () => {
			spyOn(store.investmentResource, 'reload');
			TestBed.inject(CurrencyService).setBaseCurrency(SupportedCurrency.EUR);
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.investmentResource.reload).toHaveBeenCalled();
		});

		it('does not reload investmentResource when currency has not changed', () => {
			spyOn(store.investmentResource, 'reload');
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.investmentResource.reload).not.toHaveBeenCalled();
		});
	});
});
