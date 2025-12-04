import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { CurrentUserService } from "../../../private/current-user.service";
import { NavigationService } from "../../navigation/navigation.service";

export const loggedInGuard: CanActivateFn = async (
	route: ActivatedRouteSnapshot,
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
