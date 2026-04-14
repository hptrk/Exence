import { SupportedCurrency } from '../user-settings/SupportedCurrency';

export interface WorkspaceSettingsPatchRequest {
	baseCurrency?: SupportedCurrency;
	showBaseCurrency?: boolean;
}
