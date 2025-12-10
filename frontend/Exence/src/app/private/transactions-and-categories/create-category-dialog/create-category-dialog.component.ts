import { Component, inject } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Category } from "../../../data-model/modules/category/Category";
import { TransactionType } from "../../../data-model/modules/transaction/TransactionType";
import { ButtonComponent } from "../../../shared/button/button.component";
import { InputClearButtonComponent } from "../../../shared/input-clear-button/input-clear-button.component";
import { CategoryService } from "../../category.service";
import { MatMenuModule } from "@angular/material/menu";
import { PickerComponent } from "@ctrl/ngx-emoji-mart";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { MatIconModule } from "@angular/material/icon";

@Component({
	selector: 'ex-create-category-dialog',
	templateUrl: './create-category-dialog.component.html',
	styleUrl: './create-category-dialog.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		MatMenuModule,
		MatIconModule,
		PickerComponent,
		InputClearButtonComponent,
		ButtonComponent,
	],
})
export class CreateCategoryDialogComponent {
	private readonly dialogRef = inject(MatDialogRef<CreateCategoryDialogComponent>);
	private readonly categoryService = inject(CategoryService);
	private readonly fb = inject(NonNullableFormBuilder);

	data = inject(MAT_DIALOG_DATA);

	form = this.fb.group({
		name: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		emoji: this.fb.control<string>('', [Validators.required]),
	});

	emojiInvalid = false;

	ngOnInit(): void {
		this.form.controls.emoji.valueChanges.subscribe(emoji => {
			this.emojiInvalid = !emoji;
		})		
	}

	onEmojiSelect(event: EmojiEvent): void {
		const emoji = event.emoji.native;
		if (!emoji) return;
		this.form.controls.emoji.setValue(emoji);
	}

	close(): void {
		this.dialogRef.close();
	}

	async create(): Promise<void> {
		const formValue = this.form.getRawValue();
		const request: Category = {
			name: formValue.name,
			emoji: formValue.emoji,
		};
		try {
			const newCategory = await this.categoryService.create(request);
			this.dialogRef.close(newCategory);
		} catch (err) {
			this.dialogRef.close();
			throw err;
		}
	}
}