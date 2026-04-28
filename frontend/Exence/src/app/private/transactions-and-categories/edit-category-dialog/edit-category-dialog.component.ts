import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CategoryGet } from '../../../data-model/modules/category/CategoryGet';
import { CategoryPatch } from '../../../data-model/modules/category/CategoryPatch';
import { MaterialIcon } from '../../../data-model/modules/category/MaterialIcon';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent } from '../../../shared/dialog/dialog.service';
import { CategoryIconInfo, IconPickerComponent } from '../../../shared/icon-picker/icon-picker.component';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ValidatorComponent } from '../../../shared/validator/validator.component';

export type EditCategoryDialogData = CategoryGet;
export type EditCategoryDialogResult = CategoryPatch | null;

@Component({
	selector: 'ex-edit-category-dialog',
	templateUrl: './edit-category-dialog.component.html',
	styleUrl: './edit-category-dialog.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		InputClearButtonComponent,
		ButtonComponent,
		ValidatorComponent,
		DialogCardComponent,
		IconPickerComponent,
		AutoTrimDirective,
		ConfirmExitDialogDirective,
		TranslatePipe,
	],
})
export class EditCategoryDialogComponent extends DialogComponent<EditCategoryDialogData, EditCategoryDialogResult> {
	private readonly fb = inject(NonNullableFormBuilder);

	data = this.dialogRef.value;

	form = this.fb.group({
		name: this.fb.control<string>(this.data.name, [
			Validators.required,
			Validators.minLength(1),
			Validators.maxLength(25),
		]),
		icon: this.fb.group({
			icon: this.fb.control<MaterialIcon | null>(this.data.icon, [Validators.required]),
			color: this.fb.control<string>(this.data.color, [Validators.required]),
		}),
		note: this.fb.control<string>(this.data.note ?? '', [Validators.maxLength(500)]),
	});

	close(): void {
		this.dialogRef.close(null);
	}

	save(): void {
		if (this.form.invalid) return;
		const formValue = this.form.getRawValue();
		const request: CategoryPatch = {
			name: formValue.name,
			icon: formValue.icon.icon!,
			color: formValue.icon.color,
			note: formValue.note,
		};
		this.dialogRef.submit(request);
	}

	onIconSelected(iconInfo: CategoryIconInfo): void {
		this.form.controls.icon.patchValue({
			icon: iconInfo.icon,
			color: iconInfo.color,
		});
	}
}
