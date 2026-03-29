export class PrivateRoutes {
	index(): string {
		return '/';
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
}

export class NavigationServiceForPrivate {
	getRoutes(): PrivateRoutes {
		return new PrivateRoutes();
	}
}
