import { inject, resource } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { Category } from '../../data-model/modules/category/Category';
import { CategorySummaryResponse } from '../../data-model/modules/category/CategorySummaryResponse';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { CategoryService } from './category.service';
import { CategoryFilter } from '../../data-model/modules/category/CategoryFilter';
import { CategoryType } from '../../data-model/modules/category/CategoryType';

interface CategoryStoreData {
	topCategoriesFilter: CategoryFilter;
}

const initialState: CategoryStoreData = {
	topCategoriesFilter: { type: CategoryType.EXPENSE },
};

export const CategoryStore = signalStore(
	// TODO when private.component is created provide it there and user change will recreate the instance and reset data
	{ providedIn: 'root' },

	withState(initialState),

	withProps((store, categoryService = inject(CategoryService)) => {
		return {
			categoryResource: resource<Category[], undefined>({
				loader: async () => await categoryService.list(),
			}),
			topCategoriesResource: resource<CategorySummaryResponse[], { filters: CategoryFilter }>({
				params: () => ({ filters: store.topCategoriesFilter() }),
				loader: async ({ params }) => await categoryService.listTop(params.filters),
			}),
		};
	}),

	withMethods((store, categoryService = inject(CategoryService), snackbarService = inject(SnackbarService)) => {
		function triggerReload(): void {
			store.categoryResource.reload();
			store.topCategoriesResource.reload();
		}

		return {
			async createCategory(request: Category): Promise<void> {
				const newCategory = await categoryService.create(request);
				snackbarService.showSuccess(`Category '${newCategory.icon}' created successfully!`);
				triggerReload();
			},
			async deleteCategory(id: number): Promise<void> {
				await categoryService.delete(id);
				snackbarService.showSuccess('Category deleted successfully!');
				triggerReload();
			},

			toggleTopCategoriesType(type?: CategoryType): void {
				patchState(store, state => ({
					...state,
					topCategoriesFilter: { ...store.topCategoriesFilter(), type: type ?? CategoryType.EXPENSE },
				}));
			},
		};
	}),
);
