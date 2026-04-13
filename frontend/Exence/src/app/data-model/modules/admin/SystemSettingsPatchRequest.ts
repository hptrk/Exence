export interface SystemSettingsPatchRequest {
	domainWhitelistOnly?: boolean;
	verificationRequiredPaths?: string[];
	rateLimitingEnabled?: boolean;
	rateLimitingCooldownMinutes?: number;
	logoutFromAllDevices?: boolean;
	passwordHistoryCount?: number;
}
