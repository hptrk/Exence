import { Component, computed, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Category } from 'src/app/data-model/modules/category/Category';
import { CategorySummaryResponse } from '../../../data-model/modules/category/CategorySummaryResponse';
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { CategoryStore } from '../../transactions-and-categories/category.store';
import { CreateCategoryDialogComponent } from '../../transactions-and-categories/create-category-dialog/create-category-dialog.component';
import { CreateTransactionDialogComponent } from '../../transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { TranslationCode } from '../../../shared/i18n/translation-types';

// TODO move to interval filter component when created
export enum DateInterval {
	DAY = 'DAY',
	MONTH = 'MONTH',
	YEAR = 'YEAR',
}

export interface IntervalInfo {
	type: DateInterval;
	value: number;
}

@Component({
	selector: 'ex-categories',
	templateUrl: './categories.component.html',
	styleUrl: './categories.component.scss',
	imports: [
		MatProgressBarModule,
		MatCardModule,
		MatIconModule,
		MatButtonToggleModule,
		ReactiveFormsModule,
		ButtonComponent,
		EnumValuePipe,
		TranslatePipe,
		UpperCasePipe,
	],
})
export class CategoriesComponent extends BaseComponent {
	private readonly dialog = inject(DialogService);
	private readonly categoryStore = inject(CategoryStore);
	readonly display = inject(DisplaySizeService);

	totalExpense = input.required<number>();
	totalIncome = input.required<number>();
	topCategories = input.required<CategorySummaryResponse[]>();
	categories = input.required<Category[]>();

	categoryType = signal<CategoryType>(CategoryType.EXPENSE);

	hasCategories = computed(() => !!this.categories().length);
	hasTransactions = computed(() => !!this.topCategories().length);

	categoryTypes = CategoryType;

	async openCreateCategoryDialog(): Promise<void> {
		await this.dialog.openNonModal(CreateCategoryDialogComponent, undefined);
	}

	async openCreateTransactionDialog(): Promise<void> {
		await this.dialog.openNonModal(CreateTransactionDialogComponent, undefined);
	}

	calcPercentage(amount: number): number {
		if (this.categoryType() === CategoryType.INCOME) {
			return Math.floor((amount / this.totalIncome()) * 100);
		}
		return Math.floor((amount / this.totalExpense()) * 100);
	}

	onTypeChanged(type: CategoryType): void {
		this.categoryType.set(type);
		this.categoryStore.toggleTopCategoriesType(type);
	}

	codeForCategoryType(type: CategoryType): TranslationCode {
		return `categoryType.${type}`;
	}
}
