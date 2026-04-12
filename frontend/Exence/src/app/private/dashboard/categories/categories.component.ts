import { UpperCasePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { CategorySummaryResponse } from '../../../data-model/modules/category/CategorySummaryResponse';
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import { RecurringTransactionCreate } from '../../../data-model/modules/transaction/RecurringTransactionCreate';
import { TransactionCreate } from '../../../data-model/modules/transaction/TransactionCreate';
import { AnimatedSkeletonLoaderComponent } from '../../../shared/animated-skeleton-loader/animated-skeleton-loader.component';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { TranslationCode } from '../../../shared/i18n/translation-types';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { CategoryStore } from '../../transactions-and-categories/category.store';
import { CreateCategoryDialogComponent } from '../../transactions-and-categories/create-category-dialog/create-category-dialog.component';
import {
	CreateTransactionDialogComponent,
	CreateTransactionDialogData,
	CreateTransactionDialogResult,
} from '../../transactions-and-categories/create-transaction-dialog/create-transaction-dialog.component';
import { RecurringStore } from '../../transactions-and-categories/recurring.store';
import { TransactionStore } from '../../transactions-and-categories/transaction.store';

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
		TranslatePipe,
		UpperCasePipe,
		AnimatedSkeletonLoaderComponent,
	],
})
export class CategoriesComponent extends BaseComponent {
	private readonly dialog = inject(DialogService);
	private readonly categoryStore = inject(CategoryStore);
	private readonly transactionStore = inject(TransactionStore);
	private readonly recurringStore = inject(RecurringStore);
	readonly display = inject(DisplaySizeService);

	isLoading = input.required<boolean>();
	totalExpense = input.required<number>();
	totalIncome = input.required<number>();
	topCategories = input.required<CategorySummaryResponse[]>();
	categories = input.required<CategoryGet[]>();

	categoryType = signal<CategoryType>(CategoryType.EXPENSE);

	hasCategories = computed(() => !!this.categories().length);
	hasTransactions = computed(() => !!this.topCategories().length);

	categoryTypes = CategoryType;
	listTypes = Object.values(CategoryType).filter(t => t !== CategoryType.MIXED);

	async openCreateCategoryDialog(): Promise<void> {
		const result = await this.dialog.openNonModal(CreateCategoryDialogComponent, undefined);
		if (!result) return;
		this.categoryStore.createCategory(result);
	}

	async openCreateTransactionDialog(): Promise<void> {
		const result = await this.dialog.openNonModal<
			CreateTransactionDialogData | undefined,
			CreateTransactionDialogResult | null
		>(CreateTransactionDialogComponent, undefined);
		if (!result) return;
		if (result.isRecurring) {
			this.recurringStore.createRecurringTransaction(result.result as RecurringTransactionCreate);
		} else {
			this.transactionStore.createTransaction(result.result as TransactionCreate);
		}
	}

	calcPercentage(amount: number): number {
		if (this.categoryType() === CategoryType.INCOME) {
			return Math.round((amount / this.totalIncome()) * 10000) / 100;
		}
		return Math.round((amount / this.totalExpense()) * 10000) / 100;
	}

	onTypeChanged(type: Exclude<CategoryType, CategoryType.MIXED>): void {
		this.categoryType.set(type);
		this.categoryStore.toggleTopCategoriesType(type);
	}

	codeForCategoryType(type: CategoryType): TranslationCode {
		return `categoryType.${type}`;
	}
}
