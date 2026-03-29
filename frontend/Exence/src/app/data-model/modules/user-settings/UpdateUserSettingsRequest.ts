import { DisplayTheme } from '../../../shared/display-theme.service';
import { SupportedCurrency } from './SupportedCurrency';

export interface UpdateUserSettingsRequest {
	language?: string;
	primaryTheme?: DisplayTheme;
	secondaryTheme?: DisplayTheme;
	baseCurrency?: SupportedCurrency;
	showBaseCurrency?: boolean;
}
