import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from '../../shared/button/button.component';
import { BaseComponent } from '../../shared/base-component/base.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { InputClearButtonComponent } from '../../shared/input-clear-button/input-clear-button.component';
import { RouterLink } from "@angular/router";
import { NavigationService } from '../../shared/navigation/navigation.service';

@Component({
	selector: 'ex-registration',
	templateUrl: './registration.component.html',
	styleUrl: './registration.component.scss',
	imports: [MatCardModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInput, ButtonComponent, InputClearButtonComponent, RouterLink]
})
export class RegistrationComponent extends BaseComponent {
	private readonly fb = inject(NonNullableFormBuilder);
	readonly navigate = inject(NavigationService);

	form = this.fb.group({
		username: this.fb.control<string | null>(null, [Validators.required, Validators.maxLength(255)]),
		email: this.fb.control<string | null>(null, [Validators.required, Validators.email]),
		password: this.fb.control<string | null>(null, [Validators.required, Validators.maxLength(255)]),
		confirmPassword: this.fb.control<string | null>(null, [Validators.required, Validators.maxLength(255)]) 
	});

	register(): void {

	}
}
