import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { CurrentUserService } from '../../user/current-user.service';

export const loggedOutGuard: CanActivateFn = (
	route: ActivatedRouteSnapshot,
) => {
	const router = inject(Router);
	const currentUserService = inject(CurrentUserService);
	const navigationService = inject(NavigationService);

	if (route.queryParams['password-changed'] === 'true') {
		return true;
	}

	if (!currentUserService.isLoggedIn) return true;
	
	router.navigate([navigationService.private().index()]);
	return false;
};
