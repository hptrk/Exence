import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Category } from '../../../data-model/modules/category/Category';
import { CategoryType } from '../../../data-model/modules/category/CategoryType';
import { MaterialIcon } from '../../../data-model/modules/category/MaterialIcon';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent } from '../../../shared/dialog/dialog.service';
import { CategoryIconInfo, IconPickerComponent } from '../../../shared/icon-picker/icon-picker.component';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryStore } from '../category.store';
import { TranslocoPipe } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';

@Component({
	selector: 'ex-create-category-dialog',
	templateUrl: './create-category-dialog.component.html',
	styleUrl: './create-category-dialog.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatMenuModule,
		MatIconModule,
		MatButtonToggleModule,
		InputClearButtonComponent,
		ButtonComponent,
		ValidatorComponent,
		DialogCardComponent,
		IconPickerComponent,
		AutoTrimDirective,
		ConfirmExitDialogDirective,
		EnumValuePipe,
		TranslocoPipe,
		UpperCasePipe,
	],
})
export class CreateCategoryDialogComponent extends DialogComponent<undefined, void> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly store = inject(CategoryStore);

	data = this.dialogRef.value;

	categoryTypes = CategoryType;

	form = this.fb.group({
		name: this.fb.control<string>('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
		icon: this.fb.group({
			icon: this.fb.control<MaterialIcon | null>(null, [Validators.required]),
			color: this.fb.control<string>('', [Validators.required]),
		}),
		type: this.fb.control<CategoryType>(CategoryType.EXPENSE, [Validators.required]),
		note: this.fb.control<string>('', [Validators.maxLength(500)]),
	});

	close(): void {
		this.dialogRef.close();
	}

	create(): void {
		if (this.form.invalid) return;
		const formValue = this.form.getRawValue();
		const request: Category = {
			name: formValue.name,
			icon: formValue.icon.icon!,
			color: formValue.icon.color,
			type: formValue.type,
			note: formValue.note,
		};
		this.store.createCategory(request);
		this.dialogRef.submit();
	}

	onIconSelected(iconInfo: CategoryIconInfo): void {
		this.form.controls.icon.patchValue({
			icon: iconInfo.icon,
			color: iconInfo.color,
		});
	}

	codeForCategoryType(type: CategoryType): string {
		return `categoryType.${type}`;
	}
}
