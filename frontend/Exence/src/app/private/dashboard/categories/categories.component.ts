import { Component, computed, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Category } from '../../../data-model/modules/category/Category';
import { Transaction } from '../../../data-model/modules/transaction/Transaction';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { DisplaySizeService } from '../../../shared/display-size.service';
import { ButtonComponent } from '../../../shared/button/button.component';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { Router } from '@angular/router';

// TODO move to interval filter component when created
export enum DateInterval {
	DAY = 'DAY',
	MONTH = 'MONTH',
	YEAR = 'YEAR',
}

export type IntervalInfo = {
	type: DateInterval;
	value: number;
};

@Component({
	selector: 'ex-categories',
	imports: [MatProgressBarModule, MatCardModule, ButtonComponent],
	templateUrl: './categories.component.html',
	styleUrl: './categories.component.scss',
})
export class CategoriesComponent extends BaseComponent {
	public display = inject(DisplaySizeService);
	private readonly navigation = inject(NavigationService);
	private readonly router = inject(Router);

	expenses = input.required<Transaction[]>();
	intervalFilter = input.required<IntervalInfo>();
	// TODO get top 3 categories based on the filter
	categories = input.required<Category[]>();

	// TODO when date-fns installed
	filteredExpenses = computed(() => this.expenses().filter(t => {}));
	topCategories = computed(() => this.categories()?.slice(0, 3));

	calcPercentage(id: number): number | undefined {
		const totalAmount = this.expenses().reduce((sum, expense) => sum + expense.amount, 0);

		const expenses = this.expenses();
		if (!expenses.length) return;
		const categoryExpense = expenses.reduce((sum, ex) => sum + ex.amount, 0);
		return Math.round((categoryExpense / totalAmount) * 100);
	}

	// TODO this will for sure change later, just a reminder implementation
	// move to transacions -> categories, sign that on init create dialog should be openned
	create(): void {
		this.router.navigate([this.navigation.private().transactions()], {
			queryParams: { new: true },
		});
	}
}
