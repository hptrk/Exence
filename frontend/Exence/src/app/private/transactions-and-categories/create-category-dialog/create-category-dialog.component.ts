import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Category } from '../../../data-model/modules/category/Category';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent } from '../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { CategoryService } from '../../category.service';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { StopPropagationDirective } from "src/app/shared/stop-propagation.directive";

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
		PickerComponent,
		InputClearButtonComponent,
		ButtonComponent,
		ValidatorComponent,
		DialogCardComponent,
		AutoTrimDirective,
		ConfirmExitDialogDirective,
		StopPropagationDirective,
	],
})
export class CreateCategoryDialogComponent extends DialogComponent<undefined, boolean> {
	private readonly categoryService = inject(CategoryService);
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly snackbarService = inject(SnackbarService);

	data = this.dialogRef.value;

	form = this.fb.group({
		name: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		emoji: this.fb.control<string>('', [Validators.required]),
		note: this.fb.control<string>('', [Validators.maxLength(500)]),
	});

	emojiInvalid = false;

	ngOnInit(): void {
		this.form.controls.emoji.valueChanges.subscribe(emoji => {
			this.emojiInvalid = !emoji;
		});
	}

	onEmojiSelect(event: EmojiEvent): void {
		const emoji = event.emoji.native;
		if (!emoji) return;
		this.form.controls.emoji.setValue(emoji);
	}

	close(): void {
		this.dialogRef.close(false);
	}

	async create(): Promise<void> {
		const formValue = this.form.getRawValue();
		const request: Category = {
			name: formValue.name,
			emoji: formValue.emoji,
			note: formValue.note,
		};
		try {
			const newCategory = await this.categoryService.create(request);
			this.snackbarService.showSuccess(`Category '${newCategory.emoji}' created successfully!`);
			this.dialogRef.submit(true);
		} catch (_err) {
			this.dialogRef.submit(false);
		}
	}
}