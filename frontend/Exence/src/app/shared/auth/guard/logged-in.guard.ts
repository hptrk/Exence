import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { CurrentUserService } from '../../user/current-user.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const loggedInGuard: CanActivateFn = (
	_route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot
) => {
	const router = inject(Router);
	const currentUserService = inject(CurrentUserService);
	const navigationService = inject(NavigationService);

	return toObservable(currentUserService.user).pipe(
		filter(user => user !== null),
		take(1),
		map((user) => {
			console.log(user)
			if (user && currentUserService.isAuthenticated()) {
				return true;
			} else {
				router.navigate([navigationService.account().login()], { queryParams: { returnUrl: state.url } });
				return false;
			}
		}),
	);
};
