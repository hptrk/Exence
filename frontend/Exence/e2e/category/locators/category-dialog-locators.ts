import { Locator, Page } from '@playwright/test';

export const getCreateCategoryDialog = (page: Page): Locator => page.getByTestId('create-category-dialog');
export const getCategoryTypeToggle = (page: Page): Locator =>
	page.getByTestId('create-category-dialog').getByTestId('category-type-toggle');
export const getCategoryNameInput = (page: Page): Locator => page.getByTestId('category-name-input');
export const getCategorySubmitBtn = (page: Page): Locator => page.getByTestId('create-category-submit-btn');
export const getCategoryDialogCloseBtn = (page: Page): Locator =>
	page.getByTestId('create-category-dialog').getByTestId('close-btn');

// Icon picker
export const getIconPickerTrigger = (page: Page): Locator => page.getByTestId('icon-picker-trigger');
export const getIconPickerColors = (page: Page): Locator => page.getByTestId('icon-picker-colors');
export const getFirstColorOption = (page: Page): Locator => page.getByTestId('color-option').first();
export const getFirstIconOption = (page: Page): Locator => page.getByTestId('icon-option').first();
