import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../shared/button/button.component';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { MatCardModule } from '@angular/material/card';
import { InputClearButtonComponent } from '../../shared/input-clear-button/input-clear-button.component';
import { MatIconModule } from '@angular/material/icon';
import { BaseComponent } from '../../shared/base-component/base.component';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../../data-model/modules/auth/LoginRequest';
import { ExtraValidators } from '../../shared/validators';

@Component({
	selector: 'ex-login',
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, RouterModule, ButtonComponent, MatCardModule, InputClearButtonComponent, MatIconModule],
})
export class LoginComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);
	public navigationService = inject(NavigationService);

	loginForm = this.fb.group({
		email: this.fb.control<string>('', [Validators.required, Validators.email]),
		password: this.fb.control<string>('', [Validators.required, ExtraValidators.password])
	});

	async login(): Promise<void> {
		const formValue = this.loginForm.getRawValue();
		const request: LoginRequest = {
			email: formValue.email,
			password: formValue.password,
		};
		const resp = await this.authService.login(request);
		// TODO show snackbar for successful registration

		// TODO store tokens (refresh, access) in HttpOnly cookies (https://stackoverflow.com/questions/57650692/where-to-store-the-refresh-token-on-the-client)
		this.router.navigateByUrl(this.navigationService.private().dashboard());
	}
}
