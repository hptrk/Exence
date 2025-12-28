import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ForgotPasswordRequest } from '../../data-model/modules/auth/ForgotPasswordRequest';
import { PasswordResetRequest } from '../../data-model/modules/auth/PasswordResetRequest';
import { AuthService } from '../../shared/auth/auth.service';
import { BaseComponent } from '../../shared/base-component/base.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputClearButtonComponent } from '../../shared/input-clear-button/input-clear-button.component';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { ExtraValidators } from '../../shared/validators';
import { ValidatorComponent } from '../../shared/validator/validator.component';

@Component({
	selector: 'ex-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.scss',
	imports: [
		MatFormFieldModule,
		MatInputModule,
		ButtonComponent,
		ReactiveFormsModule,
		MatCardModule,
		MatIconModule,
		InputClearButtonComponent,
		RouterLink,
		ValidatorComponent,
	]
})
export class ForgotPasswordComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly router = inject(Router);
	private readonly authService = inject(AuthService);
	private readonly snackbarService = inject(SnackbarService);
	readonly navigation = inject(NavigationService);

	emailControl = this.fb.control<string>('', [Validators.required, Validators.email, Validators.maxLength(255)]);
	resetForm = this.fb.group({
		password: this.fb.control<string>('', [Validators.required, ExtraValidators.password]),
		confirmPassword: this.fb.control<string>('', [Validators.required, ExtraValidators.password, ExtraValidators.passwordMatch('password')])
	});
	
	token = computed(() => this.router.routerState.root.snapshot.queryParams['token'] as string);
	emailSent = signal<boolean>(false);

	navigateToLogin(): void {
		this.router.navigateByUrl(this.navigation.account().login());
	}

	async send(): Promise<void> {
		const request: ForgotPasswordRequest = {
			email: this.emailControl.getRawValue(),
		};
		await this.authService.forgotPassword(request);
		this.emailSent.set(true);
		this.snackbarService.showSuccess('Email sent!');
	}

	resend(): void {
		this.send();
	}

	changeEmail(): void {
		this.emailSent.set(false);
		this.emailControl.reset();
	}

	async resetPassword(): Promise<void> {
		const formValue = this.resetForm.getRawValue();
		const request: PasswordResetRequest = {
			token: this.token(),
			newPassword: formValue.password,
			confirmNewPassword: formValue.confirmPassword,
		};
		await this.authService.resetPassword(request);
		this.snackbarService.showSuccess('Password successfully updated!');
		this.router.navigateByUrl(this.navigation.account().login());
	}
}