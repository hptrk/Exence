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

@Component({
	selector: 'ex-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.scss',
	imports: [MatFormFieldModule, MatInputModule, ButtonComponent, ReactiveFormsModule, MatCardModule, MatIconModule, InputClearButtonComponent, RouterLink, A11yModule]
})
export class ForgotPasswordComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	private readonly router = inject(Router);
	readonly navigation = inject(NavigationService);

	emailControl = this.fb.control<string | null>(null, [Validators.required, Validators.email, Validators.maxLength(255)]);
	resetForm = this.fb.group({
		password: this.fb.control<string | null>(null, [Validators.required, Validators.maxLength(255)]),
		confirmPassword: this.fb.control<string | null>(null, [Validators.required, Validators.maxLength(255)])
	});
	
	token = computed(() => this.router.routerState.root.snapshot.queryParams['token']);
	emailSent = signal<boolean>(false);
	
	constructor() {
		super();

		effect(() => {
		});
	}

	navigateToLogin(): void {
		this.router.navigateByUrl(this.navigation.account().login());
	}

	send(): void {
		this.emailSent.set(true);
	}

	changeEmail(): void {
		this.emailSent.set(false);
		this.emailControl.reset();
	}

	resetPassword(): void {
		// TODO actual business logic
		this.router.navigateByUrl(this.navigation.account().login());
	}
}