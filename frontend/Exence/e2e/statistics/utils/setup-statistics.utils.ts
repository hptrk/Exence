import { BrowserContext, expect, Page } from '@playwright/test';
import { attemptLogin } from '../../auth/auth';
import { getCategoriesTabLabel, getCategoryListAddBtn } from '../../transactions/locators/transactions-locators';
import { getCreateCategoryDialog } from '../../category/locators/category-dialog-locators';
import { createCategory, CreateCategoryData } from '../../common/utils/create-category.utils';
import { createUniqueName } from '../../form/utils/form-utils';
import { enterEditMode } from './add-widget.utils';
import { assertNoPutSent } from './widget-request.utils';
import {
	getChartWidgetDeleteBtns,
	getChartWidgetItems,
	getSaveBtn,
	getStatCardDeleteBtns,
	getStatCardItems,
} from '../locators/statistics-locators';

export async function createCategoryForStatistics(page: Page): Promise<void> {
	await page.goto('/transactions', { waitUntil: 'domcontentloaded' });
	await getCategoriesTabLabel(page).click();
	await getCategoryListAddBtn(page).click();
	await expect(getCreateCategoryDialog(page)).toBeVisible();
	await createCategory(page, { name: createUniqueName() } as CreateCategoryData);
	await expect(getCreateCategoryDialog(page)).not.toBeVisible();
	await page.goto('/statistics', { waitUntil: 'domcontentloaded' });
}

export async function setupStatistics(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await page.goto('/statistics', { waitUntil: 'domcontentloaded' });
}

/**
 * Sets up statistics page. captainwinnie2@exence.com already has categories,
 * satisfying the filledArray validator required by all widget types.
 */
export async function setupStatisticsWithCategory(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await createCategoryForStatistics(page);
}

export async function deleteStatCard(page: Page): Promise<void> {
	await assertNoPutSent(page, async () => {
		await getStatCardDeleteBtns(page).first().click();
	});
}

export async function deleteWidget(page: Page): Promise<void> {
	await assertNoPutSent(page, async () => {
		await getChartWidgetDeleteBtns(page).first().click();
	});
}

export async function deleteAllWidgets(page: Page): Promise<void> {
	if (!(await getStatCardItems(page).first().isVisible()) && !(await getChartWidgetItems(page).first().isVisible()))
		return;

	await enterEditMode(page);
	// stat-cards
	while (await getStatCardItems(page).first().isVisible()) {
		await deleteStatCard(page);
	}
	// widgets
	while (await getChartWidgetItems(page).first().isVisible()) {
		await deleteWidget(page);
	}
	await getSaveBtn(page).click();
}
