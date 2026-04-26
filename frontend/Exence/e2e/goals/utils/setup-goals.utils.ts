import { BrowserContext, expect, Page } from '@playwright/test';
import { attemptLogin } from '../../auth/auth';
import { getCreateCategoryDialog } from '../../category/locators/category-dialog-locators';
import { createCategory, CreateCategoryData } from '../../common/utils/create-category.utils';
import { createUniqueName } from '../../form/utils/form-utils';
import { getCategoriesTabLabel, getCategoryListAddBtn } from '../../transactions/locators/transactions-locators';
import { getGoalsEmptyCreateBtn } from '../locators/goals-locators';
import { createGoal } from './create-goal.utils';

export async function createCategoryForGoal(page: Page): Promise<void> {
	await page.goto('/transactions', { waitUntil: 'domcontentloaded' });
	await getCategoriesTabLabel(page).click();
	await getCategoryListAddBtn(page).click();
	await expect(getCreateCategoryDialog(page)).toBeVisible();
	await createCategory(page, { name: createUniqueName() } as CreateCategoryData);
	await expect(getCreateCategoryDialog(page)).not.toBeVisible();
	await page.goto('/goals', { waitUntil: 'domcontentloaded' });
}

export async function setupGoals(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await createCategoryForGoal(page);
	await createGoal(page, getGoalsEmptyCreateBtn(page));
}

export async function setupGoalsEmpty(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await createCategoryForGoal(page);
}
