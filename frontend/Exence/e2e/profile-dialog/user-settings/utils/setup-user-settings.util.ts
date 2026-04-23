import { BrowserContext, expect, Page } from '@playwright/test';
import { setupProfileDialog } from '../../utils/setup-profile-dialog.util';
import { getProfileUserSettings } from '../../locators/profile-dialog-locators';
import { getPrimaryThemeSelect } from '../locators/user-settings-locators';

export async function setupUserSettings(page: Page, context: BrowserContext): Promise<void> {
	await setupProfileDialog(page, context);
	await getProfileUserSettings(page).click();
	await expect(getPrimaryThemeSelect(page)).toBeVisible();
}
