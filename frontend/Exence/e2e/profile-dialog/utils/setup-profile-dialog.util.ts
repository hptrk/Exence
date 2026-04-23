import { BrowserContext, expect, Page } from '@playwright/test';
import { registerAndLogin } from '../../auth/auth';
import {
	getOpenBtn,
	getOpenBtnMobile,
	getOpenSidebarMenuBtn,
	getOpenSidebarMenuBtnSm,
	getProfileDialog,
} from '../locators/profile-dialog-locators';

export async function openProfileDialog(page: Page): Promise<void> {
	const openBtnXl = getOpenBtn(page);
	const openMenuTriggerMd = getOpenSidebarMenuBtn(page);
	const openMenuTriggerSm = getOpenSidebarMenuBtnSm(page);
	if (await openBtnXl.isVisible()) await openBtnXl.click();
	if (await openMenuTriggerMd.isVisible()) {
		await openMenuTriggerMd.click();
		await getOpenBtnMobile(page).click();
	}
	if (await openMenuTriggerSm.isVisible()) {
		await openMenuTriggerSm.click();
		await getOpenBtnMobile(page).click();
	}
}

export async function setupProfileDialog(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await registerAndLogin(page);
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await openProfileDialog(page);
	await expect(getProfileDialog(page)).toBeVisible();
}
