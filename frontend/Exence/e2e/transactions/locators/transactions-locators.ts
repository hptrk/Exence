import { Locator, Page } from '@playwright/test';

export const getFilterMenuBtn = (page: Page): Locator => page.getByTestId('filter-menu-btn');
export const getFilterTypeSelect = (page: Page): Locator => page.getByTestId('filter-type-select');

/** Badge showing how many filters are currently applied. */
export const getFilterBadge = (page: Page): Locator =>
	page.getByTestId('filter-menu-btn').locator('.mat-badge-content');
