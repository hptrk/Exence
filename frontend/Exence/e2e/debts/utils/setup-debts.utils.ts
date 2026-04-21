import { BrowserContext, expect, Page } from '@playwright/test';
import { DebtType } from '../../../src/app/data-model/modules/debt/DebtType';
import { attemptLogin } from '../../auth/auth';
import { getCreateCategoryDialog } from '../../category/locators/category-dialog-locators';
import { createCategory, CreateCategoryData } from '../../common/utils/create-category.utils';
import { createUniqueName } from '../../form/utils/form-utils';
import { getCategoriesTabLabel, getCategoryListAddBtn } from '../../transactions/locators/transactions-locators';
import { getDebtLentListAddBtn, getDebtsEmptyCreateBtn } from '../locators/debts-locators';
import { createDebt } from './create-debt.utils';

export async function createCategoryForDebts(page: Page): Promise<void> {
	await page.goto('/transactions', { waitUntil: 'domcontentloaded' });
	await getCategoriesTabLabel(page).click();
	await getCategoryListAddBtn(page).click();
	await expect(getCreateCategoryDialog(page)).toBeVisible();
	await createCategory(page, { name: createUniqueName() } as CreateCategoryData);
	await expect(getCreateCategoryDialog(page)).not.toBeVisible();
	await page.goto('/debts', { waitUntil: 'domcontentloaded' });
}

export async function setupDebtsWithBothLists(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await createCategoryForDebts(page);
	await createDebt(page, getDebtsEmptyCreateBtn(page), { type: DebtType.BORROWED });
	await createDebt(page, getDebtLentListAddBtn(page), { type: DebtType.LENT });
}

export async function setupDebtsWithBorrowed(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await createCategoryForDebts(page);
	await createDebt(page, getDebtsEmptyCreateBtn(page), { type: DebtType.BORROWED });
}

export async function setupDebtsWithLent(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await createCategoryForDebts(page);
	await createDebt(page, getDebtsEmptyCreateBtn(page), { type: DebtType.LENT });
}

export async function setupDebtsEmpty(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await createCategoryForDebts(page);
}
