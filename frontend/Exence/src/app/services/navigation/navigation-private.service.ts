import { NavigationServiceForProfile, ProfileRoutes } from "./navigation-profile.service";

export class PrivateRoutes {
	index(): string {
		return `/`;
	}

	dashboard(): string {
		return `/dashboard`;
	}
	transactions(): string {
		return `/transactions`;
	}
	statistics(): string {
		return `/statistics`;
	}
	goals(): string {
		return `/goals`;
	}
	debts(): string {
		return `/debts`;
	}
	profile(): ProfileRoutes {
		return new NavigationServiceForProfile().getRoutes(this.index());
	}
	settings(): string {
		return `/settings`;
	}
}

export class NavigationServiceForPrivate {
	getRoutes(): PrivateRoutes {
		return new PrivateRoutes();
	}
}
