import { SupportedCurrency } from '../user-settings/SupportedCurrency';

export interface WorkspaceCreateRequest {
	name: string;
	baseCurrency: SupportedCurrency;
}
