import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WorkspaceGet } from '../../../../data-model/modules/workspaces/WorkspaceGet';
import { WorkspaceRenameRequest } from '../../../../data-model/modules/workspaces/WorkspaceRenameRequest';
import { AutoTrimDirective } from '../../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../../shared/input-clear-button/input-clear-button.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { ValidatorComponent } from '../../../../shared/validator/validator.component';

export interface EditWorkspaceDialogData {
	workspace: WorkspaceGet;
}

@Component({
	selector: 'ex-edit-workspace-dialog',
	templateUrl: './edit-workspace-dialog.component.html',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		AutoTrimDirective,
		ButtonComponent,
		ConfirmExitDialogDirective,
		InputClearButtonComponent,
		ValidatorComponent,
		DialogCardComponent,
		TranslatePipe,
	],
})
export class EditWorkspaceDialogComponent extends DialogComponent<
	EditWorkspaceDialogData,
	WorkspaceRenameRequest | null
> {
	private readonly fb = inject(NonNullableFormBuilder);

	data = this.dialogRef.value;

	form = this.fb.group({
		name: this.fb.control<string>(this.data.workspace.name, [Validators.required, Validators.maxLength(255)]),
	});

	constructor() {
		super(inject(DialogRef));
	}

	submit(): void {
		if (this.form.invalid) return;
		this.dialogRef.submit({
			name: this.form.getRawValue().name,
		});
	}
}
