import { BrowserContext, Page } from '@playwright/test';
import { attemptLogin } from '../../auth/auth';

async function clearWidgets(page: Page): Promise<void> {
	const workspaceId = await page.evaluate(() => localStorage.getItem('workspaceId'));
	if (!workspaceId) throw new Error('clearWidgets: workspaceId not found in localStorage');

	const response = await page.context().request.put('/api/statistics/widgets/layout', {
		data: { statCards: [], charts: [] },
		headers: { 'X-Workspace-ID': workspaceId },
	});
	if (!response.ok()) {
		throw new Error(`clearWidgets failed: ${response.status()} ${await response.text()}`);
	}
}

export async function setupStatistics(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'user');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await clearWidgets(page);
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
	await clearWidgets(page);
	await page.goto('/statistics', { waitUntil: 'domcontentloaded' });
}
