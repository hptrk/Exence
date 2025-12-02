import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from "@angular/router";
import { RegisterRequest } from '../../data-model/modules/auth/RegisterRequest';
import { BaseComponent } from '../../shared/base-component/base.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputClearButtonComponent } from '../../shared/input-clear-button/input-clear-button.component';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { ExtraValidators } from '../../shared/validators';
import { AuthService } from '../auth.service';

@Component({
	selector: 'ex-registration',
	templateUrl: './registration.component.html',
	styleUrl: './registration.component.scss',
	imports: [MatCardModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInput, ButtonComponent, InputClearButtonComponent, RouterLink, MatTooltipModule]
})
export class RegistrationComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);
	readonly navigate = inject(NavigationService);

	form = this.fb.group({
		username: this.fb.control<string>('', [Validators.required, Validators.maxLength(255)]),
		email: this.fb.control<string>('', [Validators.required, Validators.email]),
		password: this.fb.control<string>('', [Validators.required, ExtraValidators.password]),
		confirmPassword: this.fb.control<string>('', [Validators.required, ExtraValidators.password, ExtraValidators.passwordMatch('password')]) 
	});

	async register(): Promise<void> {
		const formValue = this.form.getRawValue();
		const request: RegisterRequest = {
			username: formValue.username,
			email: formValue.email,
			password: formValue.password,
			confirmPassword: formValue.confirmPassword
		};
		const resp = await this.authService.register(request);
		// TODO show snackbar for successful registration

		// TODO store tokens (refresh, access) in HttpOnly cookies (https://stackoverflow.com/questions/57650692/where-to-store-the-refresh-token-on-the-client)

		this.router.navigateByUrl(this.navigate.account().login());
	}
}
