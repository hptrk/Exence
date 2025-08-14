export class ProfileRoutes {
	constructor(private readonly baseUrl: string) { }

	index(): string {
		return `${this.baseUrl}profile`
	}
}

export class NavigationServiceForProfile {
	getRoutes(baseUrl: string): ProfileRoutes {
		return new ProfileRoutes(baseUrl);
	}
}
