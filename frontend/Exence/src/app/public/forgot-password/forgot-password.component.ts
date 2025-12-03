import { Component, computed, effect, inject, signal } from "@angular/core";
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ButtonComponent } from "../../shared/button/button.component";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { BaseComponent } from "../../shared/base-component/base.component";
import { InputClearButtonComponent } from "../../shared/input-clear-button/input-clear-button.component";
import { Router, RouterLink } from "@angular/router";
import { NavigationService } from "../../shared/navigation/navigation.service";
import { A11yModule } from "@angular/cdk/a11y";
import { AuthService } from "../auth.service";
import { ForgotPasswordRequest } from "../../data-model/modules/auth/ForgotPasswordRequest";
import { ExtraValidators } from "../../shared/validators";
import { PasswordResetRequest } from "../../data-model/modules/auth/PasswordResetRequest";

@Component({
	selector: 'ex-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.scss',
	imports: [MatFormFieldModule, MatInputModule, ButtonComponent, ReactiveFormsModule, MatCardModule, MatIconModule, InputClearButtonComponent, RouterLink, A11yModule]
})
export class ForgotPasswordComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly router = inject(Router);
	private readonly authService = inject(AuthService);
	readonly navigation = inject(NavigationService);

	emailControl = this.fb.control<string>('', [Validators.required, Validators.email, Validators.maxLength(255)]);
	resetForm = this.fb.group({
		password: this.fb.control<string>('', [Validators.required, ExtraValidators.password]),
		confirmPassword: this.fb.control<string>('', [Validators.required, ExtraValidators.password, ExtraValidators.passwordMatch('password')])
	});
	
	token = computed(() => this.router.routerState.root.snapshot.queryParams['token']);
	emailSent = signal<boolean>(false);

	navigateToLogin(): void {
		this.router.navigateByUrl(this.navigation.account().login());
	}

	async send(): Promise<void> {
		const request: ForgotPasswordRequest = {
			email: this.emailControl.getRawValue(),
		};
		const resp = await this.authService.forgotPassword(request);
		this.emailSent.set(true);
	}

	resend(): void {
		this.send();
		// TODO snackbar
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
		const resp = await this.authService.resetPassword(request);
		// TODO snackbar
		// TODO store tokens in cookie
		this.router.navigateByUrl(this.navigation.account().login());
	}
}