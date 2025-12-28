import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { CurrentUserService } from '../../user/current-user.service';
import { NavigationService } from '../../navigation/navigation.service';

export const loggedOutGuard: CanActivateFn = async (
	route: ActivatedRouteSnapshot,
	_state: RouterStateSnapshot
) => {
	const router = inject(Router);
	const currentUserService = inject(CurrentUserService);
	const navigationService = inject(NavigationService);

	if (route.queryParams['password-changed'] === 'true') {
		return true;
	}

	const isLoggedIn = await currentUserService.getIsLoggedIn();
	if (!isLoggedIn) return true;
	
	router.navigate([navigationService.private().index()]);
	return false;
};
