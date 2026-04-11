import { provideZonelessChangeDetection, ɵEffectScheduler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { GoalCreate } from '../../../app/data-model/modules/goal/GoalCreate';
import { GoalGet } from '../../../app/data-model/modules/goal/GoalGet';
import { GoalPatch } from '../../../app/data-model/modules/goal/GoalPatch';
import { GoalStatus } from '../../../app/data-model/modules/goal/GoalStatus';
import { SupportedCurrency } from '../../../app/data-model/modules/user-settings/SupportedCurrency';
import { GoalStore } from '../../../app/private/goals/goal.store';
import { GoalService } from '../../../app/private/goals/goal.service';
import { CurrencyService } from '../../../app/shared/currency.service';
import { SnackbarService } from '../../../app/shared/snackbar/snackbar.service';

// Fixtures
const mockGoal: GoalGet = {
	id: 1,
	title: 'Vacation Fund',
	description: 'Saving for a trip',
	targetAmount: 5000,
	currentAmount: 1000,
	targetBaseCurrencyAmount: 5000,
	currentBaseCurrencyAmount: 1000,
	currency: SupportedCurrency.HUF,
	deadline: '2026-12-31',
	status: GoalStatus.ACTIVE,
	categoryId: 3,
	progressPercentage: 20,
};

const createRequest: GoalCreate = {
	title: 'Emergency Fund',
	targetAmount: 10000,
	currency: SupportedCurrency.HUF,
	deadline: '2027-01-01',
	categoryId: 1,
};

const patchRequest: GoalPatch = { title: 'Updated Goal' };

// GoalStore
describe('GoalStore', () => {
	let store: InstanceType<typeof GoalStore>;
	let mockGoalService: jasmine.SpyObj<GoalService>;
	let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
	let mockTranslocoService: jasmine.SpyObj<TranslocoService>;

	beforeEach(() => {
		mockGoalService = jasmine.createSpyObj('GoalService', ['list', 'create', 'update', 'delete']);
		mockGoalService.list.and.resolveTo([mockGoal]);
		mockGoalService.create.and.resolveTo(mockGoal);
		mockGoalService.update.and.resolveTo(mockGoal);
		mockGoalService.delete.and.resolveTo(undefined as unknown as void);

		mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess']);
		mockTranslocoService = jasmine.createSpyObj('TranslocoService', ['translate']);
		mockTranslocoService.translate.and.returnValue('translated message');

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				GoalStore,
				{ provide: GoalService, useValue: mockGoalService },
				{ provide: SnackbarService, useValue: mockSnackbarService },
				{ provide: TranslocoService, useValue: mockTranslocoService },
				CurrencyService,
			],
		});

		store = TestBed.inject(GoalStore);
	});

	// Initial state
	describe('initial state', () => {
		it('starts with an empty goals array', () => {
			expect(store.goals()).toEqual([]);
		});
	});

	// createGoal
	describe('createGoal', () => {
		it('calls goalService.create with the request', async () => {
			await store.createGoal(createRequest);
			expect(mockGoalService.create).toHaveBeenCalledOnceWith(createRequest);
		});

		it('shows a success snackbar after creation', async () => {
			await store.createGoal(createRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads the goal resource after creation', async () => {
			spyOn(store.goalResource, 'reload');
			await store.createGoal(createRequest);
			expect(store.goalResource.reload).toHaveBeenCalled();
		});
	});

	// updateGoal
	describe('updateGoal', () => {
		it('calls goalService.update with id and patch', async () => {
			await store.updateGoal(1, patchRequest);
			expect(mockGoalService.update).toHaveBeenCalledOnceWith(1, patchRequest);
		});

		it('shows a success snackbar after update', async () => {
			await store.updateGoal(1, patchRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads the goal resource after update', async () => {
			spyOn(store.goalResource, 'reload');
			await store.updateGoal(1, patchRequest);
			expect(store.goalResource.reload).toHaveBeenCalled();
		});
	});

	// deleteGoal
	describe('deleteGoal', () => {
		it('calls goalService.delete with the goal id', async () => {
			await store.deleteGoal(1);
			expect(mockGoalService.delete).toHaveBeenCalledOnceWith(1);
		});

		it('shows a success snackbar after deletion', async () => {
			await store.deleteGoal(1);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads the goal resource after deletion', async () => {
			spyOn(store.goalResource, 'reload');
			await store.deleteGoal(1);
			expect(store.goalResource.reload).toHaveBeenCalled();
		});
	});

	// resetState
	describe('resetState', () => {
		it('reloads the goal resource', () => {
			spyOn(store.goalResource, 'reload');
			store.resetState();
			expect(store.goalResource.reload).toHaveBeenCalled();
		});
	});

	// currency change effect
	describe('currency change effect', () => {
		it('reloads goalResource when baseCurrency changes to a new value', () => {
			spyOn(store.goalResource, 'reload');
			TestBed.inject(CurrencyService).setBaseCurrency(SupportedCurrency.EUR);
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.goalResource.reload).toHaveBeenCalled();
		});

		it('does not reload goalResource when currency has not changed', () => {
			spyOn(store.goalResource, 'reload');
			TestBed.inject(ɵEffectScheduler).flush();
			expect(store.goalResource.reload).not.toHaveBeenCalled();
		});
	});
});
