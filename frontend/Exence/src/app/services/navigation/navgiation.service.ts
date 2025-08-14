import { Injectable } from "@angular/core";
import { AccountRoutes, NavigationServiceForAccount } from "./navgiation-account.service";
import { NavigationServiceForPrivate, PrivateRoutes } from "./navigation-private.service";

@Injectable({
	providedIn: 'root'
})
export class NavigationService {
	// Every route that is related to the user account should go in navigation-account.service.ts
	account(): AccountRoutes {
		return new NavigationServiceForAccount().getRoutes();
	}

	// Every route that can't be accessed without logging in first should go in navigation-private.service.ts
	private(): PrivateRoutes {
		return new NavigationServiceForPrivate().getRoutes();
	}
}