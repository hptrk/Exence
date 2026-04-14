import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoService } from '@jsverse/transloco';
import { WorkspaceCreateRequest } from '../../../../data-model/modules/workspaces/WorkspaceCreateRequest';
import { SupportedCurrency } from '../../../../data-model/modules/user-settings/SupportedCurrency';
import { AutoTrimDirective } from '../../../../shared/auto-trim.directive';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../../shared/confirm-exit-dialog.directive';
import { CurrencyService } from '../../../../shared/currency.service';
import { DialogCardComponent } from '../../../../shared/dialog-card/dialog-card.component';
import { DialogComponent, DialogRef } from '../../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../../shared/input-clear-button/input-clear-button.component';
import { EnumValuePipe } from '../../../../shared/pipes/enum-value.pipe';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { localizeCurrency } from '../../../../shared/util/utils';
import { ValidatorComponent } from '../../../../shared/validator/validator.component';

@Component({
	selector: 'ex-create-workspace-dialog',
	templateUrl: './create-workspace-dialog.component.html',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		AutoTrimDirective,
		ButtonComponent,
		ConfirmExitDialogDirective,
		InputClearButtonComponent,
		ValidatorComponent,
		DialogCardComponent,
		EnumValuePipe,
		TranslatePipe,
	],
})
export class CreateWorkspaceDialogComponent extends DialogComponent<undefined, WorkspaceCreateRequest | null> {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly currencyService = inject(CurrencyService);
	private readonly translocoService = inject(TranslocoService);

	currencies = SupportedCurrency;

	form = this.fb.group({
		name: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		baseCurrency: this.fb.control<SupportedCurrency>(this.currencyService.baseCurrency(), [Validators.required]),
	});

	constructor() {
		super(inject(DialogRef));
	}

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}

	create(): void {
		if (this.form.invalid) return;
		const v = this.form.getRawValue();
		const request: WorkspaceCreateRequest = {
			name: v.name,
			baseCurrency: v.baseCurrency,
		};
		this.dialogRef.submit(request);
	}
}
