import { DisplayTheme } from '../../../shared/display-theme.service';
import { SupportedCurrency } from './SupportedCurrency';

export interface UserSettingsResponse {
	language: string;
	primaryTheme: DisplayTheme;
	secondaryTheme: DisplayTheme;
	baseCurrency: SupportedCurrency;
	showBaseCurrency: boolean;
}
