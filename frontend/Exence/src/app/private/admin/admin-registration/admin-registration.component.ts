import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegisterRequest } from '../../../data-model/modules/auth/RegisterRequest';
import { BaseComponent } from '../../../shared/base-component/base.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { CurrencyService } from '../../../shared/currency.service';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { EnumValuePipe } from '../../../shared/pipes/enum-value.pipe';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ShowPasswordComponent } from '../../../shared/show-password/show-password.component';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { AutoTrimDirective } from '../../../shared/auto-trim.directive';
import { StopPropagationDirective } from '../../../shared/stop-propagation.directive';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { ExtraValidators } from '../../../shared/validators';
import { SupportedCurrency } from '../../../data-model/modules/user-settings/SupportedCurrency';
import { localizeCurrency } from '../../../shared/util/utils';
import { TranslocoService } from '@jsverse/transloco';
import { AdminAuthService } from '../admin-auth.service';

@Component({
	selector: 'ex-admin-registration',
	templateUrl: './admin-registration.component.html',
	imports: [
		MatCardModule,
		MatIconModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatTooltipModule,
		MatSelectModule,
		MatInput,
		ButtonComponent,
		InputClearButtonComponent,
		ValidatorComponent,
		ShowPasswordComponent,
		AutoTrimDirective,
		StopPropagationDirective,
		TranslatePipe,
		EnumValuePipe,
	],
	providers: [AdminAuthService],
})
export class AdminRegistrationComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly adminAuthService = inject(AdminAuthService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly translocoService = inject(TranslocoService);
	private readonly currencyService = inject(CurrencyService);

	showPassword = signal<boolean>(false);

	currencies = SupportedCurrency;

	form = this.fb.group({
		username: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		workspaceName: this.fb.control<string>('', [Validators.required, Validators.maxLength(100)]),
		email: this.fb.control<string>('', [Validators.required, Validators.email]),
		password: this.fb.control<string>('', [Validators.required, ExtraValidators.password]),
		confirmPassword: this.fb.control<string>('', [
			Validators.required,
			ExtraValidators.password,
			ExtraValidators.passwordMatch('password'),
		]),
		currency: this.fb.control<SupportedCurrency>(this.currencyService.baseCurrency(), [Validators.required]),
	});

	togglePassword(): void {
		this.showPassword.update(value => !value);
	}

	async register(): Promise<void> {
		const formValue = this.form.getRawValue();
		const request: RegisterRequest = {
			username: formValue.username,
			email: formValue.email,
			password: formValue.password,
			confirmPassword: formValue.confirmPassword,
			baseCurrency: formValue.currency,
			workspaceName: formValue.workspaceName,
		};
		await this.adminAuthService.register(request);
		this.snackbarService.showSuccess('Admin user created successfully.');
		this.form.reset();
	}

	localizeCurrency(currency: SupportedCurrency): string {
		return localizeCurrency(currency, this.translocoService.getActiveLang());
	}
}
