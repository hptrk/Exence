import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import {
	CATEGORY_FILTERABLE_WIDGET_TYPES,
	WIDGET_CATEGORY_TYPES,
	StatisticsWidgetType,
} from '../../../data-model/modules/statistics/widget-config.model';
import { WidgetSetting } from '../../../data-model/modules/statistics/WidgetSetting';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { SelectAutoFocusDirective } from '../../../shared/select-auto-focus.directive';
import { toRawValueSignal } from '../../../shared/util/utils';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryService } from '../../transactions-and-categories/category.service';
import { ExtraValidators } from '../../../shared/validators';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';

export interface EditChartDialogData {
	title: string;
	type: StatisticsWidgetType;
	settings?: Record<string, unknown>;
}

export interface EditChartDialogResult {
	title: string;
	settings: Record<string, unknown>;
}

@Component({
	selector: 'ex-edit-chart-dialog',
	templateUrl: './edit-chart-dialog.component.html',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatIconModule,
		DialogCardComponent,
		ValidatorComponent,
		InputClearButtonComponent,
		AutoTrimDirective,
		ButtonComponent,
		ConfirmExitDialogDirective,
		MatDialogClose,
		SelectAutoFocusDirective,
		TranslatePipe,
	],
})
export class EditChartDialogComponent extends DialogComponent<EditChartDialogData, EditChartDialogResult | null> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly categoryService = inject(CategoryService);

	data = this.dialogRef.value;

	private readonly categoryFilterableWidgets = CATEGORY_FILTERABLE_WIDGET_TYPES;

	form = this.fb.group({
		title: this.fb.control<string>(this.data.title, [Validators.required, Validators.maxLength(255)]),
		categories: this.fb.group({
			selectedCategories: this.fb.control<number[]>(
				(this.data.settings?.[WidgetSetting.CATEGORY_IDS] as number[] | undefined) ?? [],
				[Validators.required, ExtraValidators.filledArray],
			),
			searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
		}),
	});
	selectedCategoriesValue = toRawValueSignal(this.form.controls.categories.controls.selectedCategories);

	private categories = signal<CategoryGet[]>([]);
	private searchText = toRawValueSignal(this.form.controls.categories.controls.searchText);

	filteredCategories = computed(() => {
		const search = this.searchText();
		const allowedTypes = WIDGET_CATEGORY_TYPES[this.data.type];

		let categories = this.categories();
		if (allowedTypes?.length) {
			categories = categories.filter(c => allowedTypes.includes(c.type) || c.type === CategoryType.MIXED);
		}
		if (!search) return categories;
		return categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
	});

	isCategoryFilterable = computed(() => this.categoryFilterableWidgets.includes(this.data.type));

	noneSelected = computed<boolean>(() => this.selectedCategoriesValue().length === 0);

	constructor() {
		super(inject(DialogRef));
		this.categoryService.list().then(categories => this.categories.set(categories));
		if (!this.isCategoryFilterable()) {
			this.form.controls.categories.disable();
		}
	}

	save(): void {
		if (this.form.invalid) return;

		const formValue = this.form.getRawValue();
		const settings = { ...this.data.settings } as Record<string, unknown>;

		if (this.isCategoryFilterable()) {
			const categoryIds = formValue.categories.selectedCategories;
			if (categoryIds.length > 0) {
				settings[WidgetSetting.CATEGORY_IDS] = categoryIds;
			} else {
				delete settings[WidgetSetting.CATEGORY_IDS];
			}
		}

		this.dialogRef.submit({ title: formValue.title, settings });
	}

	selectAll(): void {
		this.form.controls.categories.controls.selectedCategories.setValue(this.filteredCategories().map(c => c.id!));
	}

	deselectAll(): void {
		this.form.controls.categories.controls.selectedCategories.setValue([]);
	}
}
