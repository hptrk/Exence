import { expect, BrowserContext, Page } from '@playwright/test';
import { registerAndLogin } from '../../auth/auth';
import {
	getCategoriesTabLabel,
	getCategoryListAddBtn,
	getTransactionsTabLabel,
} from '../locators/transactions-locators';
import { getCreateCategoryDialog } from '../../category/locators/category-dialog-locators';
import { createCategory, CategoryType, CreateCategoryData } from '../../common/utils/create-category.utils';
import { createUniqueName } from '../../form/utils/form-utils';

export async function setupTransactions(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await registerAndLogin(page);
	await page.goto('/transactions', { waitUntil: 'domcontentloaded' });
	await page.waitForURL('**/transactions');
}

export async function createDefaultCategoryOnTransactionsPage(page: Page, type?: CategoryType): Promise<void> {
	await getCategoriesTabLabel(page).click();
	await getCategoryListAddBtn(page).click();
	await expect(getCreateCategoryDialog(page)).toBeVisible();
	await createCategory(page, { name: createUniqueName(), type } as CreateCategoryData);
	await expect(getCreateCategoryDialog(page)).not.toBeVisible();
	await getTransactionsTabLabel(page).click();
}
