import { User } from "./User";

export interface AuthenticationResponse {
	user: User;
	access_token: string;
	refresh_token: string;
}