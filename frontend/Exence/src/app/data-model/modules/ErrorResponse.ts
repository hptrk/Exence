export interface ErrorResponse {
	type: string;
	detail: string;
	instance: string;
	status: number;
	timestamp: string; // ISO string format
	title: string;
}
