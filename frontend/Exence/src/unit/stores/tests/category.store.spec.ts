import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { CategoryCreate } from '../../../app/data-model/modules/category/CategoryCreate';
import { CategoryGet } from '../../../app/data-model/modules/category/CategoryGet';
import { CategorySummaryResponse } from '../../../app/data-model/modules/category/CategorySummaryResponse';
import { CategoryType } from '../../../app/data-model/modules/category/CategoryType';
import { MaterialIcon } from '../../../app/data-model/modules/category/MaterialIcon';
import { CategoryStore } from '../../../app/private/transactions-and-categories/category.store';
import { CategoryService } from '../../../app/private/transactions-and-categories/category.service';
import { SnackbarService } from '../../../app/shared/snackbar/snackbar.service';

// Fixtures
const mockCategory: CategoryGet = {
	id: 1,
	name: 'Groceries',
	icon: MaterialIcon.SHOPPING_CART,
	color: '#FF5733',
	type: CategoryType.EXPENSE,
	balance: -200,
};

const mockTopCategories: Record<CategoryType, CategorySummaryResponse[]> = {
	[CategoryType.EXPENSE]: [{ id: 1, name: 'Groceries', icon: MaterialIcon.SHOPPING_CART, totalAmount: 500 }],
	[CategoryType.INCOME]: [{ id: 2, name: 'Salary', icon: MaterialIcon.WORK, totalAmount: 3000 }],
	[CategoryType.MIXED]: [],
};

const createRequest: CategoryCreate = {
	name: 'Transport',
	icon: MaterialIcon.DIRECTIONS_CAR,
	color: '#3498DB',
	type: CategoryType.EXPENSE,
};

// CategoryStore
describe('CategoryStore', () => {
	let store: InstanceType<typeof CategoryStore>;
	let mockCategoryService: jasmine.SpyObj<CategoryService>;
	let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
	let mockTranslocoService: jasmine.SpyObj<TranslocoService>;

	beforeEach(() => {
		mockCategoryService = jasmine.createSpyObj('CategoryService', ['list', 'listTopAll', 'create', 'delete']);
		mockCategoryService.list.and.resolveTo([mockCategory]);
		mockCategoryService.listTopAll.and.resolveTo(mockTopCategories);
		mockCategoryService.create.and.resolveTo(mockCategory);
		mockCategoryService.delete.and.resolveTo(undefined as unknown as void);

		mockSnackbarService = jasmine.createSpyObj('SnackbarService', ['showSuccess']);
		mockTranslocoService = jasmine.createSpyObj('TranslocoService', ['translate']);
		mockTranslocoService.translate.and.returnValue('translated message');

		TestBed.configureTestingModule({
			providers: [
				provideZonelessChangeDetection(),
				CategoryStore,
				{ provide: CategoryService, useValue: mockCategoryService },
				{ provide: SnackbarService, useValue: mockSnackbarService },
				{ provide: TranslocoService, useValue: mockTranslocoService },
			],
		});

		store = TestBed.inject(CategoryStore);
	});

	// Initial state
	describe('initial state', () => {
		it('selectedTopCategoriesType defaults to EXPENSE', () => {
			expect(store.selectedTopCategoriesType()).toBe(CategoryType.EXPENSE);
		});
	});

	// toggleTopCategoriesType
	describe('toggleTopCategoriesType', () => {
		it('sets selectedTopCategoriesType to the given type', () => {
			store.toggleTopCategoriesType(CategoryType.INCOME);
			expect(store.selectedTopCategoriesType()).toBe(CategoryType.INCOME);
		});

		it('defaults to EXPENSE when called without an argument', () => {
			store.toggleTopCategoriesType(CategoryType.INCOME);
			store.toggleTopCategoriesType();
			expect(store.selectedTopCategoriesType()).toBe(CategoryType.EXPENSE);
		});
	});

	// createCategory
	describe('createCategory', () => {
		it('calls categoryService.create with the request', async () => {
			await store.createCategory(createRequest);
			expect(mockCategoryService.create).toHaveBeenCalledOnceWith(createRequest);
		});

		it('shows a success snackbar after creation', async () => {
			await store.createCategory(createRequest);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads both category resources after creation', async () => {
			spyOn(store.categoryResource, 'reload');
			spyOn(store.topCategoriesAllResource, 'reload');
			await store.createCategory(createRequest);
			expect(store.categoryResource.reload).toHaveBeenCalled();
			expect(store.topCategoriesAllResource.reload).toHaveBeenCalled();
		});
	});

	// categoryResource
	describe('categoryResource', () => {
		async function waitForResource(): Promise<void> {
			await new Promise(resolve => setTimeout(resolve, 0));
			TestBed.flushEffects();
		}

		it('loads categories including balance from the service', async () => {
			store.categoryResource.reload();
			await waitForResource();
			expect(store.categoryResource.value()).toEqual([mockCategory]);
		});

		it('exposes the balance on each loaded category', async () => {
			store.categoryResource.reload();
			await waitForResource();
			expect(store.categoryResource.value()?.[0].balance).toBe(-200);
		});
	});

	// deleteCategory
	describe('deleteCategory', () => {
		it('calls categoryService.delete with the category id', async () => {
			await store.deleteCategory(1);
			expect(mockCategoryService.delete).toHaveBeenCalledOnceWith(1);
		});

		it('shows a success snackbar after deletion', async () => {
			await store.deleteCategory(1);
			expect(mockSnackbarService.showSuccess).toHaveBeenCalledOnceWith('translated message');
		});

		it('reloads both category resources after deletion', async () => {
			spyOn(store.categoryResource, 'reload');
			spyOn(store.topCategoriesAllResource, 'reload');
			await store.deleteCategory(1);
			expect(store.categoryResource.reload).toHaveBeenCalled();
			expect(store.topCategoriesAllResource.reload).toHaveBeenCalled();
		});
	});
});
