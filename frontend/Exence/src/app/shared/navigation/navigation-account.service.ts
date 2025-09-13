export class AccountRoutes {
	login(): string {
		return `/login`;
	}
	logout(): string {
		return `/logout`;
	}
	register(): string {
		return `/register`;
	}
}

export class NavigationServiceForAccount {
	getRoutes(): AccountRoutes {
		return new AccountRoutes();
	}
}
