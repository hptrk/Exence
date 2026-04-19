import { Locator, Page } from '@playwright/test';

export const getShowBaseCurrencyCheckbox = (page: Page): Locator => page.getByTestId('show-base-currency-checkbox');
export const getShowBaseCurrencyCheckboxInput = (page: Page): Locator =>
	getShowBaseCurrencyCheckbox(page).locator('input[type="checkbox"]');
export const getWorkspaceSettingsSaveBtn = (page: Page): Locator => page.getByTestId('workspace-settings-save-btn');
export const getWorkspaceSettingsSaveBtnInner = (page: Page): Locator =>
	getWorkspaceSettingsSaveBtn(page).getByTestId('btn');
export const getProfileDialogCloseBtn = (page: Page): Locator => page.getByTestId('profile-dialog-close-btn');
