import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrentUserService } from '../../shared/user/current-user.service';
import { ExtraValidators } from '../../shared/validators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../shared/button/button.component';
import { InputClearButtonComponent } from '../../shared/input-clear-button/input-clear-button.component';
import { ChangePasswordRequest } from '../../data-model/modules/auth/ChangePasswordRequest';
import { UpdateUserRequest } from '../../data-model/modules/auth/UpdateUserRequest';
import { UserService } from '../../shared/user/user.service';
import { MatDividerModule } from '@angular/material/divider';
import { SessionsListComponent } from '../session/sessions-list/sessions-list.component';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
	selector: 'ex-profile',
	templateUrl: './profile.component.html',
	styleUrl: './profile.component.scss',
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatDividerModule,
		ButtonComponent,
		InputClearButtonComponent,
		SessionsListComponent,
	],
})
export class ProfileComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly userService = inject(UserService);
	private readonly snackbarService = inject(SnackbarService);
	readonly currentUserService = inject(CurrentUserService);

	user = computed(() => this.currentUserService.user());

	userDataForm = this.fb.group({
		username: this.fb.control<string>(this.user().username, [Validators.required, Validators.maxLength(255)]),
		email: this.fb.control<string>(this.user().email, [Validators.required, Validators.email]),
	});

	passwordForm = this.fb.group({
		password: this.fb.control<string>('', [Validators.required, ExtraValidators.password]),
		newPassword: this.fb.control<string>('', [Validators.required, ExtraValidators.password]),
		confirmPassword: this.fb.control<string>('', [Validators.required, ExtraValidators.password, ExtraValidators.passwordMatch('newPassword')])
	});

	isUserDataFormEditing = signal<boolean>(false);
	isPasswordFormEditing = signal<boolean>(false);

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
		this.currentUserService.setUser(updatedUser);
		this.isUserDataFormEditing.set(false);
		this.snackbarService.showSuccess('Successfully saved!');
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
		this.snackbarService.showSuccess('Successfully saved!');
	}

	cancelDataEditing(): void {
		this.isUserDataFormEditing.set(false);
		this.userDataForm.reset();
	}

	cancelPasswordEditing(): void {
		this.isPasswordFormEditing.set(false);
		this.passwordForm.reset();
	}
}
