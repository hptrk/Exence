import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../shared/button/button.component';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'ex-login',
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
	imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, RouterModule, ButtonComponent, MatCardModule],
})
export class LoginComponent {
	public navigationService = inject(NavigationService);
	private readonly fb = inject(NonNullableFormBuilder);

	loginForm = this.fb.group({
		email: this.fb.control<string | null>(null, [Validators.required, Validators.email]),
		password: this.fb.control<string | null>(null, [Validators.required, Validators.maxLength(255)])
	});
}
