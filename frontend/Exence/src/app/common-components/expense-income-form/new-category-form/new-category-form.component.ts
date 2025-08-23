import { CommonModule } from '@angular/common';
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
	selector: 'ex-new-category-form',
	imports: [
		MatFormFieldModule,
		PickerComponent,
		MatMenuModule,
		ReactiveFormsModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		CommonModule,
	],
	templateUrl: './new-category-form.component.html',
	styleUrl: './new-category-form.component.scss',
})
export class NewCategoryFormComponent {
	@Output() categoryAdded = new EventEmitter<{ name: string; emoji: string }>();
	@Output() closeForm = new EventEmitter<void>();
	newCategoryForm!: FormGroup;
	showEmojiPicker: boolean = false;
	isLoaded: boolean = false;

	constructor(private fb: FormBuilder) {}

	@ViewChild(MatMenuTrigger) emojiMenuTrigger!: MatMenuTrigger;

	ngOnInit(): void {
		this.newCategoryForm = this.fb.group({
			newCategoryName: ['', Validators.required],
			newCategoryEmoji: ['💵', Validators.required],
		});

		this.newCategoryForm.get('newCategoryEmoji')?.valueChanges.subscribe(value => {
			if (value) {
				this.emojiMenuTrigger.closeMenu();
			}
		});

		// Set isLoaded to true after initialization
		setInterval(() => {
			this.isLoaded = true;
		}, 0);
	}

	saveCategory(): void {
		const newCategoryName = this.newCategoryForm.get('newCategoryName')?.value;
		const newCategoryEmoji = this.newCategoryForm.get('newCategoryEmoji')?.value;
		if (newCategoryName && newCategoryEmoji) {
			this.categoryAdded.emit({
				name: newCategoryName,
				emoji: newCategoryEmoji,
			});
			this.newCategoryForm.reset();
		}
	}

	cancelCategory(): void {
		this.newCategoryForm.reset();
		this.closeForm.emit();
	}

	addEmoji(event: any): void {
		const emoji = event.emoji.native;
		this.newCategoryForm.get('newCategoryEmoji')?.setValue(emoji);
		this.showEmojiPicker = false;
	}
}
