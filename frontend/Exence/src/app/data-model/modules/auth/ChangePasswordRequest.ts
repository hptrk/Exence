export interface ChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}
