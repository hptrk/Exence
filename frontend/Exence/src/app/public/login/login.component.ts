import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { LoginRequest } from '../../data-model/modules/auth/LoginRequest';
import { AuthService } from '../../shared/auth/auth.service';
import { BaseComponent } from '../../shared/base-component/base.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputClearButtonComponent } from '../../shared/input-clear-button/input-clear-button.component';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { CurrentUserService } from '../../shared/user/current-user.service';
import { ValidatorComponent } from '../../shared/validator/validator.component';
import { ExtraValidators } from '../../shared/validators';
import { AutoTrimDirective } from '../../shared/auto-trim.directive';
import { StopPropagationDirective } from '../../shared/stop-propagation.directive';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ShowPasswordComponent } from '../../shared/show-password/show-password.component';

@Component({
	selector: 'ex-login',
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	imports: [
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		MatButtonModule,
		RouterModule,
		MatCardModule,
		MatIconModule,
		InputClearButtonComponent,
		ButtonComponent,
		ValidatorComponent,
		ShowPasswordComponent,
		AutoTrimDirective,
		StopPropagationDirective,
		TranslatePipe,
	],
})
export class LoginComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);
	private readonly currentUserService = inject(CurrentUserService);
	readonly navigationService = inject(NavigationService);

	showPassword = signal<boolean>(false);

	loginForm = this.fb.group({
		email: this.fb.control<string>('', [Validators.required, Validators.email]),
		password: this.fb.control<string>('', [Validators.required, ExtraValidators.password]),
	});

	togglePassword(): void {
		this.showPassword.update(value => !value);
	}

	async login(): Promise<void> {
		const formValue = this.loginForm.getRawValue();
		const request: LoginRequest = {
			email: formValue.email,
			password: formValue.password,
		};
		const resp = await this.authService.login(request);
		this.currentUserService.user = resp.user;
		this.router.navigateByUrl(this.navigationService.private().dashboard());
	}
}
