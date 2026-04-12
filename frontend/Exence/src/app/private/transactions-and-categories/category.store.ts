import { computed, inject, resource } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { CategorySummaryResponse } from '../../data-model/modules/category/CategorySummaryResponse';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { CategoryService } from './category.service';
import { CategoryType } from '../../data-model/modules/category/CategoryType';
import { TranslocoService } from '@jsverse/transloco';
import { CategoryCreate } from '../../data-model/modules/category/CategoryCreate';
import { CategoryGet } from '../../data-model/modules/category/CategoryGet';

interface CategoryStoreData {
	selectedTopCategoriesType: Exclude<CategoryType, CategoryType.MIXED>;
}

const initialState: CategoryStoreData = {
	selectedTopCategoriesType: CategoryType.EXPENSE,
};

export const CategoryStore = signalStore(
	withState(initialState),

	withProps((_, categoryService = inject(CategoryService)) => {
		return {
			categoryResource: resource<CategoryGet[], undefined>({
				loader: async () => await categoryService.list(),
			}),
			topCategoriesAllResource: resource<
				Record<Exclude<CategoryType, CategoryType.MIXED>, CategorySummaryResponse[]>,
				undefined
			>({
				loader: async () => await categoryService.listTopAll(),
			}),
		};
	}),

	withComputed(store => ({
		topCategories: computed<CategorySummaryResponse[]>(
			() => store.topCategoriesAllResource.value()?.[store.selectedTopCategoriesType()] ?? [],
		),
	})),

	withMethods(
		(
			store,
			categoryService = inject(CategoryService),
			snackbarService = inject(SnackbarService),
			translocoService = inject(TranslocoService),
		) => {
			function triggerReload(): void {
				store.categoryResource.reload();
				store.topCategoriesAllResource.reload();
			}

			return {
				async createCategory(request: CategoryCreate): Promise<void> {
					const newCategory = await categoryService.create(request);
					snackbarService.showSuccess(
						translocoService.translate('category.create.successInfo', { name: newCategory.name }),
					);
					triggerReload();
				},
				async deleteCategory(id: number): Promise<void> {
					await categoryService.delete(id);
					snackbarService.showSuccess(translocoService.translate('category.deleteInfo'));
					triggerReload();
				},

				toggleTopCategoriesType(type?: Exclude<CategoryType, CategoryType.MIXED>): void {
					patchState(store, {
						selectedTopCategoriesType: type ?? CategoryType.EXPENSE,
					});
				},
			};
		},
	),
);
