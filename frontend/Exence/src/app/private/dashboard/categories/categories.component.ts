import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Category } from '../../../data-model/modules/category/Category';
import { CategorySummaryResponse } from '../../../data-model/modules/category/CategorySummaryResponse';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { CreateCategoryDialogComponent } from '../../transactions-and-categories/create-category-dialog/create-category-dialog.component';

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
	imports: [MatProgressBarModule, MatCardModule, ButtonComponent],
	templateUrl: './categories.component.html',
	styleUrl: './categories.component.scss',
})
export class CategoriesComponent extends BaseComponent {
	public display = inject(DisplaySizeService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly dialog = inject(MatDialog);

	totalExpense = input.required<number>();
	categories = input.required<CategorySummaryResponse[]>();

	openCreateCategoryDialog(): void {
		this.dialog.open<CreateCategoryDialogComponent, undefined, Category>(
			CreateCategoryDialogComponent, undefined
		).afterClosed().subscribe((newCategory) => {
			if (newCategory) {
				this.snackbarService.showSuccess(`Category '${newCategory.emoji}' created successfully!`);
			}
		});
	}

	calcPercentage(amount: number): number {
		return Math.floor((amount / this.totalExpense()) * 100);
	}
}
