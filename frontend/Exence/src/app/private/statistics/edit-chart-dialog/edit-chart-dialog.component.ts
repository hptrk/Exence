import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { WidgetType } from '../../../data-model/modules/statistics/widget-config.model';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { DialogCardComponent } from '../../../shared/dialog-card/dialog-card.component';
import { DialogComponent } from '../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { toRawValueSignal } from '../../../shared/util/utils';
import { ValidatorComponent } from '../../../shared/validator/validator.component';

export interface EditChartDialogData {
	title: string;
	type: WidgetType;
	settings?: Record<string, unknown>;
}

@Component({
	selector: 'ex-edit-chart-dialog',
	templateUrl: './edit-chart-dialog.component.html',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInput,
		DialogCardComponent,
		ValidatorComponent,
		InputClearButtonComponent,
		AutoTrimDirective,
		ButtonComponent,
		ConfirmExitDialogDirective,
	],
})
export class EditChartDialogComponent extends DialogComponent<EditChartDialogData, string | null> {
	// TODO return type will not remain string, need information on what to be changable on each chart, currently only the title
	private readonly fb = inject(NonNullableFormBuilder);

	data = this.dialogRef.value;

	form = this.fb.group({
		title: this.fb.control<string>(this.data.title, [Validators.required, Validators.maxLength(255)]),
	});
	formValueSignal = toRawValueSignal(this.form);

	save(): void {
		if (this.form.invalid) return;
		this.dialogRef.submit(this.formValueSignal().title);
	}
}
