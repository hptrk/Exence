import { BrowserContext, Page } from '@playwright/test';
import { attemptLogin } from '../../auth/auth';

export async function setupAdmin(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'admin');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await page.goto('/admin', { waitUntil: 'domcontentloaded' });
}
