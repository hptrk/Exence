import { Component, computed, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CategorySummaryResponse } from '../../../data-model/modules/category/CategorySummaryResponse';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { CreateCategoryDialogComponent } from '../../transactions-and-categories/create-category-dialog/create-category-dialog.component';
import { CreateTransactionDialogComponent } from '../../transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { Category } from 'src/app/data-model/modules/category/Category';

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
	imports: [
		MatProgressBarModule,
		MatCardModule,
		ButtonComponent
	],
	templateUrl: './categories.component.html',
	styleUrl: './categories.component.scss',
})
export class CategoriesComponent extends BaseComponent {
	public display = inject(DisplaySizeService);
	private readonly dialog = inject(DialogService);

	totalExpense = input.required<number>();
	topCategories = input.required<CategorySummaryResponse[]>();
	categories = input.required<Category[]>();

	hasCategories = computed(() => !!this.categories().length)
	hasTransactions = computed(() => !!this.topCategories().length)

	async openCreateCategoryDialog(): Promise<void> {
		await this.dialog.openNonModal(
			CreateCategoryDialogComponent, undefined
		);
	}

	async openCreateTransactionDialog(): Promise<void> {
		await this.dialog.openNonModal(
			CreateTransactionDialogComponent, undefined
		);
	}

	calcPercentage(amount: number): number {
		return Math.floor((amount / this.totalExpense()) * 100);
	}
}
