export interface DeviceSession {
	sessionId: string;
	deviceName: string;
	browser: string;
	operatingSystem: string;
	ipAddress: string;
	lastUsedAt: string;
	createdAt: string; // ISO string
	currentSession: boolean;
}
