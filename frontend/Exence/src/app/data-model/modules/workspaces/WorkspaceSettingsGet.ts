import { SupportedCurrency } from '../user-settings/SupportedCurrency';

export interface WorkspaceSettingsGet {
	baseCurrency: SupportedCurrency;
	showBaseCurrency: boolean;
}
