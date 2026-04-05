import { Locator, Page } from '@playwright/test';

export const getSnackbar = (page: Page): Locator => page.getByTestId('snackbar').last();

export const getErrorSnackbar = (page: Page): Locator => {
	return getSnackbar(page).locator('mat-icon.type-icon', { hasText: 'error' }).last();
};

export const getWarningSnackbar = (page: Page): Locator => {
	return getSnackbar(page).locator('mat-icon.type-icon', { hasText: 'warning' }).last();
};

export const getInfoSnackbar = (page: Page): Locator => {
	return getSnackbar(page).locator('mat-icon.type-icon', { hasText: 'info' }).last();
};

export const getSuccessSnackbar = (page: Page): Locator => {
	return getSnackbar(page).locator('mat-icon.type-icon', { hasText: 'check' }).last();
};

export const getSnackbarCloseBtn = (page: Page): Locator => page.getByTestId('closeBtn');
