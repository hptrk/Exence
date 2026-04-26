import { Browser, BrowserContext, expect, Page } from '@playwright/test';
import { attemptLogin } from '../../../auth/auth';
import { openProfileDialog } from '../../utils/setup-profile-dialog.util';
import { getProfileDialog, getProfileSessions } from '../../locators/profile-dialog-locators';
import { getSessionsThisSessionTitle } from '../locators/sessions-locators';

export async function setupSessions(page: Page, context: BrowserContext, browser: Browser): Promise<void> {
	const secondContext = await browser.newContext();
	const secondPage = await secondContext.newPage();
	await secondPage.addInitScript(() => localStorage.setItem('language', 'en'));
	await attemptLogin(secondPage, 'user');
	await secondContext.close();

	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => localStorage.setItem('language', 'en'));
	await attemptLogin(page, 'user');
	await openProfileDialog(page);
	await expect(getProfileDialog(page)).toBeVisible();
	await getProfileSessions(page).click();
	await expect(getSessionsThisSessionTitle(page)).toBeVisible();
}
