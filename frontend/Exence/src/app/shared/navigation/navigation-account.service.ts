export class AccountRoutes {
	private baseUrl = '/public';

	login(): string {
		return `${this.baseUrl}/login`;
	}
	logout(): string {
		return `${this.baseUrl}/logout`;
	}
	register(): string {
		return `${this.baseUrl}/register`;
	}
	forgotPassword(): string {
		return `${this.baseUrl}/forgot-password`;
	}
}

export class NavigationServiceForAccount {
	getRoutes(): AccountRoutes {
		return new AccountRoutes();
	}
}
