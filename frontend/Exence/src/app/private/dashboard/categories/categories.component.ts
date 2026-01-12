import { Component, inject, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CategorySummaryResponse } from '../../../data-model/modules/category/CategorySummaryResponse';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { CreateCategoryDialogComponent } from '../../transactions-and-categories/create-category-dialog/create-category-dialog.component';
import { CreateTransactionDialogComponent, CreateTransactionDialogData } from '../../transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { Transaction } from 'src/app/data-model/modules/transaction/Transaction';

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
	categorySummaries = input.required<CategorySummaryResponse[]>();
	categories = input.required<Category[]>();

	async openCreateCategoryDialog(): Promise<void> {
		await this.dialog.openNonModal(
			CreateCategoryDialogComponent, undefined
		);
	}

	public openCreateTransactionDialog(): void {
			this.dialog.open<CreateTransactionDialogComponent, CreateTransactionDialogData, Transaction>(
				CreateTransactionDialogComponent, undefined
			).afterClosed().subscribe(
				 (newTransaction?: Transaction) => {
					if (newTransaction) {
						this.snackbarService.showSuccess(`Transaction '${newTransaction.title.slice(0, 10)}${newTransaction.title.length > 10 ? '...' : ''}' created successfully!`);
						this.dataChangedEvent.emit();
					}
				}
			);
		}

	calcPercentage(amount: number): number {
		return Math.floor((amount / this.totalExpense()) * 100);
	}

	get hasCategories(): boolean {
		return this.categories().length > 0;
	}

	get hasTransactions(): boolean {
		return this.categorySummaries().length > 0;
	}
}
