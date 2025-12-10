import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../shared/account/auth.service';

@Component({
	selector: 'ex-login',
	imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, RouterModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	private fb = inject(FormBuilder);
	private authService = inject(AuthService);

	public loginForm!: FormGroup;

	ngOnInit() {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
		});
	}

	onSubmit(): void {
		if (this.loginForm.valid) {
			this.authService.login(this.loginForm.value).subscribe(
				() => {
					console.log('Login successful');
				},
				error => {
					console.error('Login failed', error);
				},
			);
		}
	}
}
