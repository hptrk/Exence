import { DisplayTheme } from '../../../shared/display-theme.service';

export interface UpdateUserSettingsRequest {
	language?: string;
	primaryTheme?: DisplayTheme;
	secondaryTheme?: DisplayTheme;
}
