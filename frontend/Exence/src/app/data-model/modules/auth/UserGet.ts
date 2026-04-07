import { Role } from './Role';

export interface UserGet {
	id: number;
	username: string;
	email: string;
	isVerified: boolean;
	role: Role;
}
