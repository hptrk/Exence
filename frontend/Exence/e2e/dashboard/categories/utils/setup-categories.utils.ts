import { BrowserContext, Page } from '@playwright/test';
import { registerAndLogin } from '../../../auth/auth';

export async function setupCategories(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await registerAndLogin(page);
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
}
