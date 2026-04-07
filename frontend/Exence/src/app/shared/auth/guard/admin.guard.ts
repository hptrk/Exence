import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { CurrentUserService } from '../../user/current-user.service';

export const adminGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
	const router = inject(Router);
	const currentUserService = inject(CurrentUserService);
	const navigationServcei = inject(NavigationService);

	/* eslint-disable */
	return toObservable(currentUserService.user).pipe(
		filter(user => user !== null),
		take(1),
		map(user => {
			if (user && currentUserService.isAdmin()) {
				return true;
			} else {
				router.navigate([navigationServcei.private().dashboard()]);
				return false;
			}
		}),
	);
};
