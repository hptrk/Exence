import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { DialogCardComponent } from '../../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../../shared/dialog/dialog.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
	selector: 'ex-add-path-dialog',
	templateUrl: './add-path-dialog.component.html',
	imports: [ReactiveFormsModule, MatFormFieldModule, MatInput, ButtonComponent, DialogCardComponent, TranslatePipe],
})
export class AddPathDialogComponent extends DialogComponent<undefined, string | null> {
	private readonly fb = inject(NonNullableFormBuilder);

	readonly form = this.fb.group({
		path: this.fb.control<string>('', [Validators.required]),
	});

	constructor() {
		super(inject(DialogRef));
	}

	add(): void {
		const trimmed = this.form.controls.path.value.trim();
		if (!trimmed) return;
		this.dialogRef.submit(trimmed);
	}
}
