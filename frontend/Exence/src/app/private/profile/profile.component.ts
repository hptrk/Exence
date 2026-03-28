import { Component, computed, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { ChangePasswordRequest } from '../../data-model/modules/auth/ChangePasswordRequest';
import { UpdateUserRequest } from '../../data-model/modules/auth/UpdateUserRequest';
import { User } from '../../data-model/modules/auth/User';
import { AutoTrimDirective } from '../../shared/auto-trim.directive';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputClearButtonComponent } from '../../shared/input-clear-button/input-clear-button.component';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { StopPropagationDirective } from '../../shared/stop-propagation.directive';
import { CurrentUserService } from '../../shared/user/current-user.service';
import { UserService } from '../../shared/user/user.service';
import { ValidatorComponent } from '../../shared/validator/validator.component';
import { ExtraValidators } from '../../shared/validators';
import { SessionsListComponent } from '../session/sessions-list/sessions-list.component';
import { ShowPasswordComponent } from '../../shared/show-password/show-password.component';

@Component({
	selector: 'ex-profile',
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatDividerModule,
		MatTooltipModule,
		ButtonComponent,
		InputClearButtonComponent,
		SessionsListComponent,
		ValidatorComponent,
		ShowPasswordComponent,
		AutoTrimDirective,
		StopPropagationDirective,
		TranslatePipe,
	],
})
export class ProfileComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly userService = inject(UserService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly router = inject(Router);
	private readonly navigationService = inject(NavigationService);
	private readonly translocoService = inject(TranslocoService);
	readonly currentUserService = inject(CurrentUserService);

	isUserDataFormEditing = signal<boolean>(false);
	isPasswordFormEditing = signal<boolean>(false);
	showPassword = signal<boolean>(false);

	user = computed<User>(() => this.currentUserService.user());

	userDataForm = this.fb.group({
		username: this.fb.control<string>(this.user().username, [Validators.required, Validators.maxLength(255)]),
		email: this.fb.control<string>(this.user().email, [Validators.required, Validators.email]),
	});

	passwordForm = this.fb.group({
		password: this.fb.control<string>('', [Validators.required, ExtraValidators.password]),
		newPassword: this.fb.control<string>('', [Validators.required, ExtraValidators.password]),
		confirmPassword: this.fb.control<string>('', [
			Validators.required,
			ExtraValidators.password,
			ExtraValidators.passwordMatch('newPassword'),
		]),
	});

	constructor() {
		this.userDataForm.controls.email.disable();
		effect(() => {
			const isUserDataFormDisabled = !this.isUserDataFormEditing();
			if (isUserDataFormDisabled) {
				this.userDataForm.controls.username.disable();
			} else {
				this.userDataForm.controls.username.enable();
			}
		});
	}

	async saveUserData(): Promise<void> {
		if (this.userDataForm.invalid) return;
		const formValue = this.userDataForm.getRawValue();
		const request: UpdateUserRequest = {
			username: formValue.username,
		};
		const updatedUser = await this.userService.updateUser(request);
		this.currentUserService.user = updatedUser;
		this.isUserDataFormEditing.set(false);
		this.snackbarService.showSuccess(this.translocoService.translate('profile.saved'));
	}

	async savePassword(): Promise<void> {
		if (this.passwordForm.invalid) return;
		const formValue = this.passwordForm.getRawValue();
		const request: ChangePasswordRequest = {
			oldPassword: formValue.password,
			newPassword: formValue.newPassword,
			confirmNewPassword: formValue.confirmPassword,
		};
		await this.userService.changePassword(request);
		this.isPasswordFormEditing.set(false);
		this.router.navigate([this.navigationService.account().login()], {
			queryParams: { ['password-changed']: 'true' },
		});
		this.snackbarService.showSuccess(this.translocoService.translate('profile.saved'));
	}

	cancelDataEditing(): void {
		this.isUserDataFormEditing.set(false);
		this.userDataForm.reset();
	}

	cancelPasswordEditing(): void {
		this.isPasswordFormEditing.set(false);
		this.passwordForm.reset();
	}

	togglePassword(): void {
		this.showPassword.update(value => !value);
	}
}
