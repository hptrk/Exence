export interface PasswordResetRequest {
	token: string;
	newPassword: string;
	confirmNewPassword: string;
}
