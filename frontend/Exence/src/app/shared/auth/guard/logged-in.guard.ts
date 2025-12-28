import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { CurrentUserService } from '../../user/current-user.service';

export const loggedInGuard: CanActivateFn = async (
	_route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot
) => {
	const router = inject(Router);
	const currentUserService = inject(CurrentUserService);
	const navigationService = inject(NavigationService);

	const isLoggedIn = await currentUserService.getIsLoggedIn();
	if (isLoggedIn) return true;
	
	router.navigate([navigationService.account().login()], { queryParams: { returnUrl: state.url } });
	return false;
};
