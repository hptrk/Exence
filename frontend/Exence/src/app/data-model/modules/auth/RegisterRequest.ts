import { SupportedCurrency } from '../user-settings/SupportedCurrency';

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
	currency: SupportedCurrency;
}
