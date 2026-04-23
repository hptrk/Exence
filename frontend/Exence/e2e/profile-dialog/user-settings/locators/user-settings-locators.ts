import { Locator, Page } from '@playwright/test';

// Theme - selects
export const getPrimaryThemeSelect = (page: Page): Locator => page.getByTestId('theme-select-primary');
export const getSecondaryThemeSelect = (page: Page): Locator => page.getByTestId('theme-select-secondary');

// Theme - dropdown options (rendered in CDK overlay while a select is open)
export const getThemeOptions = (page: Page): Locator => page.locator('mat-option');
export const getThemeOptionColorSquares = (page: Page): Locator => page.getByTestId('theme-color-square');
export const getThemeCurrentIndicator = (page: Page): Locator => page.getByTestId('theme-current-indicator');

// Theme - validation error (shown when primary === secondary)
export const getThemeSelectError = (page: Page): Locator => page.getByTestId('theme-select-error');

// Language cards
export const getLanguageList = (page: Page): Locator => page.getByTestId('language-list');
export const getLanguageCards = (page: Page): Locator => page.locator('[data-testid^="language-card-"]');
export const getLanguageCard = (page: Page, lang: string): Locator => page.getByTestId(`language-card-${lang}`);
export const getSelectedLanguageCard = (page: Page): Locator => page.locator('[data-testid^="language-card-"].selected');

// Save / Cancel / Spinner
export const getUserSettingsSaveBtn = (page: Page): Locator => page.getByTestId('user-settings-save-btn');
export const getUserSettingsSaveBtnInner = (page: Page): Locator =>
	page.getByTestId('user-settings-save-btn').getByTestId('btn');
export const getUserSettingsCancelBtn = (page: Page): Locator => page.getByTestId('user-settings-cancel-btn');
export const getUserSettingsSpinner = (page: Page): Locator => page.getByTestId('user-settings-spinner');
