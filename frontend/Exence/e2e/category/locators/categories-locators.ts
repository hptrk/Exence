import { Locator, Page } from '@playwright/test';

export const getCategoriesCard = (page: Page): Locator => page.getByTestId('categories-card');
export const getAddCategoryBtn = (page: Page): Locator => page.getByTestId('add-category-btn');
export const getCategoryItems = (page: Page): Locator => page.getByTestId('category-item');
export const getCategoryTypeToggle = (page: Page): Locator =>
	page.getByTestId('categories-card').getByTestId('category-type-toggle');
export const getCategoryTypeToggleChecked = (page: Page): Locator =>
	page
		.getByTestId('categories-card')
		.getByTestId('category-type-toggle')
		.locator('mat-button-toggle.mat-button-toggle-checked');
export const getCategoriesNoTransactionsState = (page: Page): Locator =>
	page.getByTestId('categories-no-transactions-state');
export const getCategoriesNoCategoriesState = (page: Page): Locator =>
	page.getByTestId('categories-no-categories-state');
export const getCreateFirstTransactionBtn = (page: Page): Locator => page.getByTestId('create-first-transaction-btn');
export const getCreateFirstCategoryBtn = (page: Page): Locator => page.getByTestId('create-first-category-btn');
