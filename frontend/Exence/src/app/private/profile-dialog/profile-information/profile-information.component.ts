import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { ChangePasswordRequest } from '../../../data-model/modules/auth/ChangePasswordRequest';
import { UpdateUserRequest } from '../../../data-model/modules/auth/UpdateUserRequest';
import { User } from '../../../data-model/modules/auth/User';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ConfirmExitDialogDirective } from '../../../shared/confirm-exit-dialog.directive';
import { DialogRef } from '../../../shared/dialog/dialog.service';
import { InputClearButtonComponent } from '../../../shared/input-clear-button/input-clear-button.component';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { ShowPasswordComponent } from '../../../shared/show-password/show-password.component';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { toRawValueSignal } from '../../../shared/util/utils';
import { CurrentUserService } from '../../../shared/user/current-user.service';
import { UserService } from '../../../shared/user/user.service';
import { ValidatorComponent } from '../../../shared/validator/validator.component';
import { ExtraValidators } from '../../../shared/validators';

@Component({
	selector: 'ex-profile-information',
	templateUrl: './profile-information.component.html',
	styleUrl: './profile-information.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatDividerModule,
		MatTooltipModule,
		MatInput,
		ButtonComponent,
		ValidatorComponent,
		ShowPasswordComponent,
		InputClearButtonComponent,
		TranslatePipe,
		ConfirmExitDialogDirective,
	],
})
export class ProfileInformationComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly userService = inject(UserService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly router = inject(Router);
	private readonly navigationService = inject(NavigationService);
	private readonly translocoService = inject(TranslocoService);
	readonly currentUserService = inject(CurrentUserService);

	dialogRef = input.required<DialogRef<void, void>>();

	readonly hasChangesChange = output<boolean>();

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

	profileForm = this.fb.group({ user: this.userDataForm, password: this.passwordForm });
	profileFormValue = toRawValueSignal(this.profileForm);
	hasChanges = computed(() => {
		this.profileFormValue();
		return this.profileForm.dirty;
	});

	constructor() {
		effect(() => {
			this.hasChangesChange.emit(this.hasChanges());
		});

		this.userDataForm.controls.email.disable();
		this.passwordForm.controls.password.disable();
		this.passwordForm.controls.newPassword.disable();
		this.passwordForm.controls.confirmPassword.disable();
		effect(() => {
			const isUserDataFormDisabled = !this.isUserDataFormEditing();
			if (isUserDataFormDisabled) {
				this.userDataForm.controls.username.disable();
			} else {
				this.userDataForm.controls.username.enable();
			}
		});

		effect(() => {
			const isPasswordFormDisabled = !this.isPasswordFormEditing();
			if (isPasswordFormDisabled) {
				this.passwordForm.controls.password.disable();
				this.passwordForm.controls.newPassword.disable();
				this.passwordForm.controls.confirmPassword.disable();
			} else {
				this.passwordForm.controls.password.enable();
				this.passwordForm.controls.newPassword.enable();
				this.passwordForm.controls.confirmPassword.enable();
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
