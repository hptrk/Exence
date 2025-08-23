import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'ex-register',
	imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, RouterModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
	private fb = inject(FormBuilder);
	private authService = inject(AuthService);

	public registerForm!: FormGroup;

	ngOnInit(): void {
		this.registerForm = this.fb.group({
			username: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
		});
	}

	onSubmit(): void {
		if (this.registerForm.valid) {
			this.authService.register(this.registerForm.value).subscribe(
				() => {
					console.log('Registration successful');
				},
				error => {
					console.error('Registration failed', error);
				},
			);
		}
	}
}
