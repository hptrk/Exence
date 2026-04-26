import { BrowserContext, Page } from '@playwright/test';
import { attemptLoginWithEmail, registerAndLogin } from '../../../auth/auth';
import { getLogoutBtn } from '../../../sidebar/locators/sidebar-locators';
import { getProfileDialogCloseBtn } from '../../../workspace-settings/locators/workspace-settings-locators';
import { getProfileTabWorkspaceSettings } from '../../locators/profile-dialog-locators';
import { openProfileDialog, setupProfileDialog } from '../../utils/setup-profile-dialog.util';
import { createWorkspace, inviteUserToWorkspace } from './create-workspace.utils';

export async function setupWorkspaceSettings(page: Page, context: BrowserContext): Promise<void> {
	await setupProfileDialog(page, context);
	await getProfileTabWorkspaceSettings(page).click();
}

/**
 * Resetting localStorage, clear cookies and then these steps:
 *
 * - register and log in as USER1
 *
 * - open profile dialog
 *
 * - create workspace-2
 *
 * - logout
 *
 * - register and log in as USER2
 *
 * - open profile dialog
 *
 * - create workspace-3
 *
 * - invite USER-1 to workspace-3
 *
 * - logout
 *
 * - login to USER-1
 *
 * - invite USER-2 to workspace-2
 */
export async function setupMultipleWorkspacesForMultipleAccounts(
	page: Page,
	context: BrowserContext,
	name1: string,
	name2: string,
): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await registerAndLogin(page, { username: name1, workspaceName: name1, email: `${name1}@exence.com` });
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await openProfileDialog(page);
	await getProfileTabWorkspaceSettings(page).click();
	await page.waitForTimeout(100);
	await createWorkspace(page, { name: 'workspace-2' });
	await page.waitForTimeout(100);
	await getProfileDialogCloseBtn(page).click();
	await getLogoutBtn(page).click();
	await registerAndLogin(page, { username: name2, workspaceName: name2, email: `${name2}@exence.com` });
	await openProfileDialog(page);
	await getProfileTabWorkspaceSettings(page).click();
	await createWorkspace(page, { name: 'workspace-3' });
	await inviteUserToWorkspace(page, `${name1}@exence.com`, 'workspace-3');
	await getProfileDialogCloseBtn(page).click();
	await getLogoutBtn(page).click();
	await attemptLoginWithEmail(page, `${name1}@exence.com`);
	await openProfileDialog(page);
	await getProfileTabWorkspaceSettings(page).click();
	await inviteUserToWorkspace(page, `${name2}@exence.com`, 'workspace-2');
}
