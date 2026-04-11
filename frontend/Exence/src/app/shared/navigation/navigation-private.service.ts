export class PrivateRoutes {
	index(): string {
		return '/';
	}

	admin(): string {
		return '/admin';
	}
	dashboard(): string {
		return '/dashboard';
	}
	transactions(): string {
		return '/transactions';
	}
	statistics(): string {
		return '/statistics';
	}
	goals(): string {
		return '/goals';
	}
	debts(): string {
		return '/debts';
	}
	investments(): string {
		return '/investments';
	}
}

export class NavigationServiceForPrivate {
	getRoutes(): PrivateRoutes {
		return new PrivateRoutes();
	}
}
