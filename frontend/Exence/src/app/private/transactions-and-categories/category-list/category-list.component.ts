import { Component, computed, inject, input } from '@angular/core';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { CategoryCreate } from '../../../data-model/modules/category/CategoryCreate';
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import { ColumnDef, DataTableComponent, TableAction } from '../../../shared/data-table/data-table.component';
import { ExCellDirective } from '../../../shared/data-table/ex-cell.directive';
import { CategoryStore } from '../category.store';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';
import { PagedResponse } from '../../../data-model/modules/common/PagedResponse';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: 'ex-category-list',
	templateUrl: './category-list.component.html',
	styleUrl: './category-list.component.scss',
	imports: [MatTooltipModule, DataTableComponent, ExCellDirective, MatIconModule, TranslatePipe, CurrencyPipe],
})
export class CategoryListComponent {
	private readonly categoryStore = inject(CategoryStore);
	private readonly dialog = inject(DialogService);
	private readonly display = inject(DisplaySizeService);

	title = input<string>('');
	matIcon = input<string>();

	columns = computed<ColumnDef[]>(() => {
		return [
			{ key: 'title', header: 'dataTable.title', width: 'auto' },
			{ key: 'icon', header: 'dataTable.icon', width: this.display.isMd() ? '100px' : '60px' },
			{
				key: 'type',
				header: 'dataTable.type',
				width: this.display.isMd() ? '150px' : this.display.isSm() ? '100px' : '30px',
			},
			{ key: 'note', header: 'dataTable.note', width: this.display.isMd() ? '125px' : '50px' },
			{ key: 'amount', header: 'literals.balance', width: this.display.isMd() ? '200px' : '150px' },
			{ key: 'actions', header: '', width: this.display.isMd() ? '60px' : '35px' },
		];
	});

	actions: TableAction<CategoryGet>[] = [
		{
			label: 'literals.delete',
			icon: 'delete',
			color: 'warn',
			handler: row => this.categoryStore.deleteCategory(row.id),
		},
	];

	data = computed<PagedResponse<CategoryGet> | undefined>(() => {
		const content = this.categoryStore.categoryResource.value();
		if (!content) return undefined;
		return {
			content,
			page: 0,
			size: content.length,
			totalElements: content.length,
			totalPages: 1,
			first: true,
			last: true,
			numberOfElements: content.length,
		};
	});

	isLoading = computed(() => this.categoryStore.categoryResource.isLoading());

	codeForCategoryType(type: CategoryType): TranslationCode {
		return `categoryType.${type}`;
	}

	amountClass(row: CategoryGet): 'income' | 'expense' | null {
		if (row.type === CategoryType.INCOME) return 'income';
		if (row.type === CategoryType.EXPENSE) return 'expense';
		return row.balance > 0 ? 'income' : row.balance < 0 ? 'expense' : null;
	}

	async openCreate(): Promise<void> {
		const result = await this.dialog.openNonModal(CreateCategoryDialogComponent, undefined);
		if (!result) return;
		this.categoryStore.createCategory(result as CategoryCreate);
	}
}
