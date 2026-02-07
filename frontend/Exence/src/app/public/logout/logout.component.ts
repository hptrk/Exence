import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { CurrentUserService } from '../../shared/user/current-user.service';

@Component({
	selector: 'ex-logout',
	template: `
		<mat-progress-spinner
			[diameter]="150"
			strokeWidth="2"
			defaultColor="accent"
			color="primary"
			[mode]="'indeterminate'"
		/>
	`,
	imports: [MatProgressSpinner],
})
export class LogoutComponent implements OnInit {
	private readonly currentUserService = inject(CurrentUserService);
	private readonly navigationService = inject(NavigationService);
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	ngOnInit(): void {
		this.authService.logout();
		this.currentUserService.clearUser();
		this.router.navigateByUrl(this.navigationService.account().login());
	}
}
