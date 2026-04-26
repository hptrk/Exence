import { BrowserContext, Page } from '@playwright/test';
import { setupProfileDialog } from '../../utils/setup-profile-dialog.util';
import { getProfileTabProfileData } from '../../locators/profile-dialog-locators';

export async function setupProfileData(page: Page, context: BrowserContext): Promise<void> {
	await setupProfileDialog(page, context);
	await getProfileTabProfileData(page).click();
}
