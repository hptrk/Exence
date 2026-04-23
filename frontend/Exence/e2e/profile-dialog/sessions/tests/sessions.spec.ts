import test, { expect } from '@playwright/test';
import { setupSessions } from '../utils/setup-sessions.util';
import { getSuccessSnackbar } from '../../../snackbar/locators/snackbar-locators';
import {
	getSessionsCurrentItem,
	getSessionsCurrentLastUsed,
	getSessionsDeleteAllBtn,
	getSessionsOtherDeleteBtns,
	getSessionsOtherItems,
	getSessionsOtherTitle,
	getSessionsSecurityInfo,
	getSessionsThisSessionTitle,
} from '../locators/sessions-locators';
import data from '../data/sessions.data.json';

// Sessions - This session - structure
test.describe('Sessions - This session - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context, browser }) => {
		await setupSessions(page, context, browser);
	});

	test('should show this session title', async ({ page }) => {
		await expect(getSessionsThisSessionTitle(page)).toBeVisible();
		await expect(getSessionsThisSessionTitle(page)).toContainText(data.titles.thisSession);
	});

	test('should show current session item', async ({ page }) => {
		await expect(getSessionsCurrentItem(page)).toBeVisible();
	});

	test('should show last used for current session', async ({ page }) => {
		await expect(getSessionsCurrentLastUsed(page)).toBeVisible();
		await expect(getSessionsCurrentLastUsed(page)).toContainText(data.lastUsed);
	});
});

// Sessions - Security info
test.describe('Sessions - Security info', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context, browser }) => {
		await setupSessions(page, context, browser);
	});

	test('should show security info', async ({ page }) => {
		await expect(getSessionsSecurityInfo(page)).toBeVisible();
		await expect(getSessionsSecurityInfo(page)).toContainText(data.securityInfo);
	});
});

// Sessions - Other sessions - structure
test.describe('Sessions - Other sessions - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context, browser }) => {
		await setupSessions(page, context, browser);
	});

	test('should show other sessions title', async ({ page }) => {
		await expect(getSessionsOtherTitle(page)).toBeVisible();
		await expect(getSessionsOtherTitle(page)).toContainText(data.titles.otherSessions);
	});

	test('should show other session items with delete button', async ({ page }) => {
		await expect(getSessionsOtherItems(page).first()).toBeVisible();
		await expect(getSessionsOtherDeleteBtns(page).first()).toBeVisible();
	});
});

// Sessions - Delete session
test.describe('Sessions - Delete session', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context, browser }) => {
		await setupSessions(page, context, browser);
	});

	test('should navigate to landing page after deleting a session', async ({ page }) => {
		await getSessionsOtherDeleteBtns(page).first().click();
		await page.waitForURL(/\//);
	});
});

// Sessions - Delete all sessions
test.describe('Sessions - Delete all sessions', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context, browser }) => {
		await setupSessions(page, context, browser);
	});

	test('should show success snackbar after deleting all sessions', async ({ page }) => {
		await getSessionsDeleteAllBtn(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();
	});
});
