import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { CurrentUserService } from '../../user/current-user.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const loggedOutGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
	const router = inject(Router);
	const currentUserService = inject(CurrentUserService);
	const navigationService = inject(NavigationService);

	if (route.queryParams['password-changed'] === 'true') {
		return true;
	}

	/* eslint-disable */
	return toObservable(currentUserService.user).pipe(
		filter(user => user !== null),
		take(1),
		map(user => {
			if (user && currentUserService.isAuthenticated()) {
				router.navigate([navigationService.private().index()]);
				return false;
			} else {
				return true;
			}
		}),
	);
};
