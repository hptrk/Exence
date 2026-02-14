import { inject, resource } from '@angular/core';
import { signalStore, withMethods, withProps } from '@ngrx/signals';
import { Category } from '../../data-model/modules/category/Category';
import { CategorySummaryResponse } from '../../data-model/modules/category/CategorySummaryResponse';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { CategoryService } from './category.service';

export const CategoryStore = signalStore(
	// TODO when private.component is created provide it there and user change will recreate the instance and reset data
	{ providedIn: 'root' },

	withProps(() => {
		const categoryService = inject(CategoryService);
		return {
			categoryResource: resource<Category[], undefined>({
				loader: async () => await categoryService.list(),
			}),
			topCategoriesResource: resource<CategorySummaryResponse[], undefined>({
				loader: async () => await categoryService.listTop4(),
			}),
		};
	}),

	withMethods(store => {
		const categoryService = inject(CategoryService);
		const snackbarService = inject(SnackbarService);

		function triggerReload(): void {
			store.categoryResource.reload();
			store.topCategoriesResource.reload();
		}

		return {
			async createCategory(request: Category): Promise<void> {
				const newCategory = await categoryService.create(request);
				snackbarService.showSuccess(`Category '${newCategory.name}' created successfully!`);
				triggerReload();
			},
			async deleteCategory(id: number): Promise<void> {
				await categoryService.delete(id);
				snackbarService.showSuccess('Category deleted successfully!');
				triggerReload();
			},
		};
	}),
);
