import { DisplayTheme } from '../../../shared/display-theme.service';

export interface UserSettingsResponse {
	language: string;
	primaryTheme: DisplayTheme;
	secondaryTheme: DisplayTheme;
}
