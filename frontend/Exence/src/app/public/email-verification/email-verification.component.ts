import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from '../../shared/button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { AuthService } from '../../shared/auth/auth.service';
import { EmailVerificationRequest } from '../../data-model/modules/auth/EmailVerificationRequest';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
	selector: 'ex-email-verification',
	template: `
		<mat-card class="d-flex flex-column justify-content-center align-items-center gap-4 p-5">
			<mat-card-content class="d-flex flex-row flex-nowrap gap-4 w-100 p-0">
				<div>
					<div class="icon-container">
						<mat-icon size="lg">mail</mat-icon>
					</div>
				</div>

				<div>
					<h2 class="fs-1 fw-bold">Email verified</h2>
					<p class="m-0 mb-4 subtitle">
						Congratulations! Your email has been verified. You can now use all features of
						<strong>Exence</strong>.
					</p>
					<ex-button outline matIcon="keyboard_backspace" (click)="navigateToLogin()">
						Back to login
					</ex-button>
				</div>
			</mat-card-content>
		</mat-card>
	`,
	styleUrl: './email-verification.component.scss',
	imports: [MatCardModule, MatIconModule, ButtonComponent],
})
export class EmailVerificationComponent implements OnInit {
	private readonly router = inject(Router);
	private readonly navigate = inject(NavigationService);
	private readonly authService = inject(AuthService);
	private readonly snackbarService = inject(SnackbarService);

	ngOnInit(): void {
		const token = this.router.routerState.root.snapshot.queryParams['token'];
		const request: EmailVerificationRequest = { token };
		this.authService.verifyEmail(request).then(() => {
			this.snackbarService.showSuccess('Email successfully verified!');
		});
	}

	navigateToLogin(): void {
		this.router.navigateByUrl(this.navigate.account().login());
	}
}
