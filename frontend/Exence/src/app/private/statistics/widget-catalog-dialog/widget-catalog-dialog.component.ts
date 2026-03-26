import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Category } from '../../../data-model/modules/category/Category';
import { ChartWidget, StatCardWidget } from '../../../data-model/modules/statistics/Widget';
import { WidgetSetting } from '../../../data-model/modules/statistics/WidgetSetting';
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import {
	CATEGORY_FILTERABLE_WIDGET_TYPES,
	GROUP_WIDGET_TYPES,
	WIDGET_CATALOG,
	WIDGET_CATEGORY_TYPES,
	WidgetCatalogItem,
	WidgetType,
} from '../../../data-model/modules/statistics/widget-config.model';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../shared/dialog/dialog.service';
import { DisplayThemeService } from '../../../shared/display-theme.service';
import { InfoButtonComponent } from '../../../shared/info-button/info-button.component';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { SelectAutoFocusDirective } from '../../../shared/select-auto-focus.directive';
import { toRawValueSignal } from '../../../shared/util/utils';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryService } from '../../transactions-and-categories/category.service';
import { ExtraValidators } from '../../../shared/validators';

export interface WidgetCatalogDialogData {
	statCards: StatCardWidget[];
	charts: ChartWidget[];
}

export interface WidgetCatalogDialogResult {
	catalogItem: WidgetCatalogItem;
	title: string;
	settings: Record<WidgetSetting, unknown>;
}

@Component({
	selector: 'ex-widget-catalog-dialog',
	templateUrl: './widget-catalog-dialog.component.html',
	styleUrl: './widget-catalog-dialog.component.scss',
	imports: [
		ReactiveFormsModule,
		MatTabsModule,
		MatIconModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatTooltipModule,
		MatStepperModule,
		DialogCardComponent,
		ButtonComponent,
		InfoButtonComponent,
		ValidatorComponent,
		InputClearButtonComponent,
		AutoTrimDirective,
		SelectAutoFocusDirective,
	],
})
export class WidgetCatalogDialogComponent extends DialogComponent<
	WidgetCatalogDialogData,
	WidgetCatalogDialogResult | null
> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly categoryService = inject(CategoryService);
	readonly themeService = inject(DisplayThemeService);

	private readonly stepper = viewChild.required(MatStepper);

	data = this.dialogRef.value;

	readonly catalog = WIDGET_CATALOG;
	readonly cardTypes = GROUP_WIDGET_TYPES.card;
	readonly categoryFilterableWidgets = CATEGORY_FILTERABLE_WIDGET_TYPES;

	selectedTabIndex = 0;
	selectedWidget = this.fb.control<WidgetCatalogItem | null>(null, [Validators.required]);
	selectedWidgetValue = toRawValueSignal(this.selectedWidget);

	form = this.fb.group({
		title: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		categories: this.fb.group({
			selectedCategories: this.fb.control<number[]>([], [Validators.required, ExtraValidators.filledArray]),
			searchText: this.fb.control<string>('', [Validators.maxLength(25)]),
		}),
	});
	selectedCategoriesValue = toRawValueSignal(this.form.controls.categories.controls.selectedCategories);

	private categories = signal<Category[]>([]);
	private searchText = toRawValueSignal(this.form.controls.categories.controls.searchText);

	filteredCategories = computed(() => {
		const search = this.searchText();
		const selected = this.selectedWidgetValue();
		const allowedTypes = selected ? WIDGET_CATEGORY_TYPES[selected.type] : undefined;

		let categories = this.categories();
		if (allowedTypes?.length) {
			categories = categories.filter(c => allowedTypes.includes(c.type) || c.type === CategoryType.MIXED);
		}
		if (!search) return categories;
		return categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
	});

	isCategoryFilterable = computed(() => {
		const selected = this.selectedWidgetValue();
		return selected ? this.categoryFilterableWidgets.includes(selected.type) : false;
	});

	isLastStep = computed(() => {
		const s = this.stepper();
		return s.selectedIndex === s.steps.length - 1;
	});

	noneSelected = computed<boolean>(() => this.selectedCategoriesValue().length === 0);

	constructor() {
		super(inject(DialogRef));
		this.categoryService.list().then(categories => this.categories.set(categories));

		effect(() => {
			const selected = this.selectedWidgetValue();
			this.form.controls.title.setValue(selected?.title ?? '');
		});

		effect(() =>
			this.form.controls.categories.controls.selectedCategories.setValue(this.categories().map(c => c.id!)),
		);
	}

	statCardSelectionDisabled(type: WidgetType): boolean {
		return this.cardTypes.includes(type) && this.data.statCards.length === 4;
	}

	create(): void {
		const selected = this.selectedWidgetValue();
		if (!selected || this.form.invalid) return;

		const formValue = this.form.getRawValue();
		const settings = {} as Record<WidgetSetting, unknown>;

		if (this.isCategoryFilterable()) {
			const categoryIds = formValue.categories.selectedCategories;
			if (categoryIds.length > 0) {
				settings[WidgetSetting.CATEGORY_IDS] = categoryIds;
			}
		}

		this.dialogRef.close({ catalogItem: selected, title: formValue.title, settings });
	}

	selectWidget(widget: WidgetCatalogItem): void {
		if (this.statCardSelectionDisabled(widget.type)) return;
		if (this.selectedWidgetValue()?.type === widget.type) this.selectedWidget.setValue(null);
		else this.selectedWidget.setValue(widget);
	}

	nextStep(): void {
		this.stepper().next();
	}

	previousStep(): void {
		this.stepper().previous();
	}

	selectAll(): void {
		this.form.controls.categories.controls.selectedCategories.setValue(this.filteredCategories().map(c => c.id!));
	}

	deselectAll(): void {
		this.form.controls.categories.controls.selectedCategories.setValue([]);
	}
}
