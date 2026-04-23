import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutoTrimDirective } from '../../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../../shared/input-clear-button/input-clear-button.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { ValidatorComponent } from '../../../../shared/validator/validator.component';
import { WorkspaceMemberEmailRequest } from '../../../../data-model/modules/workspaces/WorkspaceMemberEmailRequest';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
	selector: 'ex-add-member-dialog',
	templateUrl: './add-member-dialog.component.html',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatDialogClose,
		AutoTrimDirective,
		ButtonComponent,
		ConfirmExitDialogDirective,
		InputClearButtonComponent,
		ValidatorComponent,
		DialogCardComponent,
		TranslatePipe,
	],
})
export class AddMemberDialogComponent extends DialogComponent<undefined, WorkspaceMemberEmailRequest | null> {
	private readonly fb = inject(NonNullableFormBuilder);

	form = this.fb.group({
		email: this.fb.control<string>('', [Validators.required, Validators.email]),
	});

	constructor() {
		super(inject(DialogRef));
	}

	submit(): void {
		if (this.form.invalid) return;
		this.dialogRef.submit({
			email: this.form.getRawValue().email,
		});
	}
}
