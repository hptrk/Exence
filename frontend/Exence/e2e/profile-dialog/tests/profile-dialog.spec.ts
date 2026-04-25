import test, { expect } from '@playwright/test';
import profileData from '../data/profile-dialog.data.json';
import {
	getProfileAchievements,
	getProfileActivity,
	getProfileSessions,
	getProfileTabProfileData,
	getProfileTabWorkspaceSettings,
	getProfileUsername,
	getProfileUserPic,
	getProfileUserSettings,
	getProfileWorkspaceBtn,
	getProfileWorkspaceMenuItems,
	getProfileWorkspaceMenuTitle,
	getProfileWorkspaceName,
} from '../locators/profile-dialog-locators';
import { openProfileDialog, setupProfileDialog } from '../utils/setup-profile-dialog.util';
import { getAddWorkspaceDialog } from '../workspaces/locators/workspaces-locators';
import { createWorkspace } from '../workspaces/utils/create-workspace.utils';

// Profile dialog sidebar - structure
test.describe('Profile dialog sidebar - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileDialog(page, context);
	});

	test.describe('on large screens', () => {
		test.use({ viewport: { width: 1400, height: 900 } });

		test('should display username', async ({ page }) => {
			await expect(getProfileUsername(page)).toBeVisible();
		});

		test('should display workspace name', async ({ page }) => {
			await expect(getProfileWorkspaceName(page)).toBeVisible();
		});

		test('should display workspace switcher', async ({ page }) => {
			await expect(getProfileWorkspaceBtn(page)).toBeVisible();
		});

		test('should display first letter of username as profile pic', async ({ page }) => {
			await expect(getProfileUserPic(page)).toHaveText('E');
		});

		test('should display tabs as icon + text', async ({ page }) => {
			await expect(getProfileTabWorkspaceSettings(page)).toBeVisible();
			await expect(getProfileTabWorkspaceSettings(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileTabWorkspaceSettings(page)).toContainText(profileData.tabs.workspaceSettings);

			await expect(getProfileTabProfileData(page)).toBeVisible();
			await expect(getProfileTabProfileData(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileTabProfileData(page)).toContainText(profileData.tabs.profileData);

			await expect(getProfileUserSettings(page)).toBeVisible();
			await expect(getProfileUserSettings(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileUserSettings(page)).toContainText(profileData.tabs.userSettings);

			await expect(getProfileSessions(page)).toBeVisible();
			await expect(getProfileSessions(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileSessions(page)).toContainText(profileData.tabs.sessions);

			await expect(getProfileActivity(page)).toBeVisible();
			await expect(getProfileActivity(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileActivity(page)).toContainText(profileData.tabs.activity);

			await expect(getProfileAchievements(page)).toBeVisible();
			await expect(getProfileAchievements(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileAchievements(page)).toContainText(profileData.tabs.achievements);
		});
	});

	test.describe('on small screens (below 768px)', () => {
		test.use({ viewport: { width: 700, height: 900 } });

		test('should not display username', async ({ page }) => {
			await expect(getProfileUsername(page)).not.toBeVisible();
		});

		test('should not display workspace name', async ({ page }) => {
			await expect(getProfileWorkspaceName(page)).not.toBeVisible();
		});

		test('should display workspace switcher', async ({ page }) => {
			await expect(getProfileWorkspaceBtn(page)).toBeVisible();
		});

		test('should display first letter of username as profile pic', async ({ page }) => {
			await expect(getProfileUserPic(page)).toHaveText('E');
		});

		test('should display tabs as icon only', async ({ page }) => {
			await expect(getProfileTabWorkspaceSettings(page)).toBeVisible();
			await expect(getProfileTabWorkspaceSettings(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileTabWorkspaceSettings(page)).toContainText('');

			await expect(getProfileTabProfileData(page)).toBeVisible();
			await expect(getProfileTabProfileData(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileTabProfileData(page)).toContainText('');

			await expect(getProfileUserSettings(page)).toBeVisible();
			await expect(getProfileUserSettings(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileUserSettings(page)).toContainText('');

			await expect(getProfileSessions(page)).toBeVisible();
			await expect(getProfileSessions(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileSessions(page)).toContainText('');

			await expect(getProfileActivity(page)).toBeVisible();
			await expect(getProfileActivity(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileActivity(page)).toContainText('');

			await expect(getProfileAchievements(page)).toBeVisible();
			await expect(getProfileAchievements(page).locator('mat-icon')).toBeVisible();
			await expect(getProfileAchievements(page)).toContainText('');
		});
	});
});

// Profile dialog sidebar - workspace selector
test.describe('Profile dialog sidebar - workspace selector', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileDialog(page, context);
	});

	test('should open menu on click and display title', async ({ page }) => {
		await getProfileWorkspaceBtn(page).click();
		await expect(getProfileWorkspaceMenuTitle(page)).toBeVisible();
	});

	test('should open menu on click and display at least 1 workspace name', async ({ page }) => {
		await getProfileWorkspaceBtn(page).click();
		await expect(getProfileWorkspaceMenuItems(page).first()).toBeVisible();
	});

	test('should color differ on workspace item hover', async ({ page }) => {
		await getProfileWorkspaceBtn(page).click();
		const workspaceItem = getProfileWorkspaceMenuItems(page).first();
		await expect(workspaceItem).toBeVisible();
		const initialBgColor = await workspaceItem.evaluate(el => getComputedStyle(el).backgroundColor);
		await workspaceItem.hover();
		const hoverBgColor = await workspaceItem.evaluate(el => getComputedStyle(el).backgroundColor);
		expect(initialBgColor).not.toBe(hoverBgColor);
		await getProfileWorkspaceMenuTitle(page).hover();
		const shouldBeInitialBgColor = await workspaceItem.evaluate(el => getComputedStyle(el).backgroundColor);
		expect(initialBgColor).toBe(shouldBeInitialBgColor);
	});
});

// Profile dialog sidebar - workspace tab changes
test.describe('Profile dialog sidebar - workspace tab changes', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileDialog(page, context);
	});

	test('should change workspace name when after workspace change', async ({ page }) => {
		await createWorkspace(page, { name: 'new workspace' });
		await expect(getAddWorkspaceDialog(page)).not.toBeVisible();
		await expect(getProfileWorkspaceName(page)).toHaveText('new workspace');
		await getProfileWorkspaceBtn(page).click();
		await expect(getProfileWorkspaceMenuTitle(page)).toBeVisible();
		await getProfileWorkspaceMenuItems(page).filter({ hasNotText: 'new workspace' }).click();
		await openProfileDialog(page);
		await expect(getProfileWorkspaceName(page)).not.toHaveText('new workspace');
	});
});

// Profile dialog sidebar - workspace tab changes
test.describe('Profile dialog sidebar - workspace tab changes', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileDialog(page, context);
	});

	test('should navigation buttons navigate to the correct pages and have selected class', async ({ page }) => {
		await getProfileTabWorkspaceSettings(page).click();
		await expect(getProfileTabWorkspaceSettings(page)).toHaveClass(/selected/);
		await expect(getProfileTabProfileData(page)).not.toHaveClass(/selected/);
		await expect(getProfileUserSettings(page)).not.toHaveClass(/selected/);
		await expect(getProfileSessions(page)).not.toHaveClass(/selected/);
		await expect(getProfileActivity(page)).not.toHaveClass(/selected/);
		await expect(getProfileAchievements(page)).not.toHaveClass(/selected/);

		await getProfileTabProfileData(page).click();
		await expect(getProfileTabProfileData(page)).toHaveClass(/selected/);
		await expect(getProfileTabWorkspaceSettings(page)).not.toHaveClass(/selected/);
		await expect(getProfileUserSettings(page)).not.toHaveClass(/selected/);
		await expect(getProfileSessions(page)).not.toHaveClass(/selected/);
		await expect(getProfileActivity(page)).not.toHaveClass(/selected/);
		await expect(getProfileAchievements(page)).not.toHaveClass(/selected/);

		await getProfileUserSettings(page).click();
		await expect(getProfileUserSettings(page)).toHaveClass(/selected/);
		await expect(getProfileTabWorkspaceSettings(page)).not.toHaveClass(/selected/);
		await expect(getProfileTabProfileData(page)).not.toHaveClass(/selected/);
		await expect(getProfileSessions(page)).not.toHaveClass(/selected/);
		await expect(getProfileActivity(page)).not.toHaveClass(/selected/);
		await expect(getProfileAchievements(page)).not.toHaveClass(/selected/);

		await getProfileSessions(page).click();
		await expect(getProfileSessions(page)).toHaveClass(/selected/);
		await expect(getProfileTabWorkspaceSettings(page)).not.toHaveClass(/selected/);
		await expect(getProfileTabProfileData(page)).not.toHaveClass(/selected/);
		await expect(getProfileUserSettings(page)).not.toHaveClass(/selected/);
		await expect(getProfileActivity(page)).not.toHaveClass(/selected/);
		await expect(getProfileAchievements(page)).not.toHaveClass(/selected/);

		await getProfileActivity(page).click();
		await expect(getProfileActivity(page)).toHaveClass(/selected/);
		await expect(getProfileTabWorkspaceSettings(page)).not.toHaveClass(/selected/);
		await expect(getProfileTabProfileData(page)).not.toHaveClass(/selected/);
		await expect(getProfileUserSettings(page)).not.toHaveClass(/selected/);
		await expect(getProfileSessions(page)).not.toHaveClass(/selected/);
		await expect(getProfileAchievements(page)).not.toHaveClass(/selected/);

		await getProfileAchievements(page).click();
		await expect(getProfileAchievements(page)).toHaveClass(/selected/);
		await expect(getProfileTabWorkspaceSettings(page)).not.toHaveClass(/selected/);
		await expect(getProfileTabProfileData(page)).not.toHaveClass(/selected/);
		await expect(getProfileUserSettings(page)).not.toHaveClass(/selected/);
		await expect(getProfileSessions(page)).not.toHaveClass(/selected/);
		await expect(getProfileActivity(page)).not.toHaveClass(/selected/);
	});
});
