import { BrowserContext, Page } from '@playwright/test';
import { attemptLogin } from '../../auth/auth';
import { getInvestmentsEmptyCreateBtn } from '../locators/investments-locators';
import { createInvestment } from './create-investment.utils';

export async function setupInvestments(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await page.goto('/investments', { waitUntil: 'domcontentloaded' });
	await createInvestment(page, getInvestmentsEmptyCreateBtn(page));
}

export async function setupInvestmentsEmpty(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await page.goto('/investments', { waitUntil: 'domcontentloaded' });
}
