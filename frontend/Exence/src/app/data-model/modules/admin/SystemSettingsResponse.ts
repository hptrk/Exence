export interface SystemSettingsResponse {
	domainWhitelistOnly: boolean;
	verificationRequiredPaths: string[];
	rateLimitingEnabled: boolean;
	rateLimitingCooldownMinutes: number;
	logoutFromAllDevices: boolean;
	passwordHistoryCount: number;
}
