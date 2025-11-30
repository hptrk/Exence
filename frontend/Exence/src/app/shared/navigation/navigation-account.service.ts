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
	forgotPassword(): string {
		return `/forgot-password`;
	}
}

export class NavigationServiceForAccount {
	getRoutes(): AccountRoutes {
		return new AccountRoutes();
	}
}
