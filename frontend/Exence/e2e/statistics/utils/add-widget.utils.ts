import { expect, Page } from '@playwright/test';
import {
	getAddMenuItem,
	getCatalogBackBtn,
	getCatalogCreateBtn,
	getCatalogItems,
	getCatalogNextBtn,
	getCatalogTitleInput,
	getEditMenuItem,
	getMoreBtn,
} from '../locators/statistics-locators';
import statisticsData from '../data/statistics.data.json';

export async function openCatalog(page: Page): Promise<void> {
	await getMoreBtn(page).click();
	await getAddMenuItem(page).click();
}

export async function enterEditMode(page: Page): Promise<void> {
	await getMoreBtn(page).click();
	await getEditMenuItem(page).click();
}

export async function selectCatalogWidgetByTitle(page: Page, title: string): Promise<void> {
	await getCatalogItems(page).filter({ hasText: title }).first().click();
}

export async function proceedToCustomize(page: Page): Promise<void> {
	await getCatalogNextBtn(page).click();
}

export async function goBackFromCustomize(page: Page): Promise<void> {
	await getCatalogBackBtn(page).click();
}

export async function createCatalogWidget(page: Page, customTitle?: string): Promise<void> {
	if (customTitle !== undefined) {
		await getCatalogTitleInput(page).fill(customTitle);
	}
	// Categories load asynchronously — wait for the form to become valid before clicking Create
	await expect(getCatalogCreateBtn(page)).not.toHaveClass(/disabled/);
	await getCatalogCreateBtn(page).click();
}

/**
 * Adds a non-category-filterable chart (SAVINGS_RATE_GAUGE).
 * Requires 1+ category to exist in the system (for form validity).
 */
export async function addNonFilterableChart(page: Page, customTitle?: string): Promise<void> {
	await openCatalog(page);
	await page.getByRole('tab', { name: statisticsData.catalog.tabAll }).click();
	await selectCatalogWidgetByTitle(page, statisticsData.widgets.savingsRateGauge.title);
	await proceedToCustomize(page);
	await createCatalogWidget(page, customTitle);
}

/**
 * Adds an expense stat card (EXPENSE_FREQUENCY_STATCARD).
 * Requires 1+ expense category to exist in the system.
 */
export async function addStatCard(page: Page, customTitle?: string): Promise<void> {
	await openCatalog(page);
	await page.getByRole('tab', { name: statisticsData.catalog.tabCards }).click();
	await selectCatalogWidgetByTitle(page, statisticsData.widgets.expenseFrequency.title);
	await proceedToCustomize(page);
	await createCatalogWidget(page, customTitle);
}

/**
 * Adds a category-filterable chart (EXPENSE_PIE).
 * Requires 1+ expense category to exist in the system.
 */
export async function addChartWithCategory(page: Page, customTitle?: string): Promise<void> {
	await openCatalog(page);
	await page.getByRole('tab', { name: statisticsData.catalog.tabAll }).click();
	await selectCatalogWidgetByTitle(page, statisticsData.widgets.expensePie.title);
	await proceedToCustomize(page);
	await createCatalogWidget(page, customTitle);
}
