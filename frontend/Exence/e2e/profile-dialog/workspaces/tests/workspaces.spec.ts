import test, { expect } from '@playwright/test';
import { attemptLoginWithEmail } from '../../../auth/auth';
import { fillAndBlur } from '../../../form/utils/form-utils';
import { getLogoutBtn } from '../../../sidebar/locators/sidebar-locators';
import { getErrorSnackbar } from '../../../snackbar/locators/snackbar-locators';
import {
	getProfileDialogCloseBtn,
	getShowBaseCurrencyCheckbox,
	getWorkspaceSettingsSaveBtn,
	getWorkspaceSettingsSavingSpinner,
} from '../../../workspace-settings/locators/workspace-settings-locators';
import { getProfileTabWorkspaceSettings, getProfileWorkspaceName } from '../../locators/profile-dialog-locators';
import { openProfileDialog } from '../../utils/setup-profile-dialog.util';
import workspaceData from '../data/workspaces.data.json';
import {
	getAddMemberAddBtn,
	getAddMemberCloseBtn,
	getAddMemberDialog,
	getAddMemberEmailInput,
	getAddMemberEmailInputClearBtn,
	getAddWorkspaceCancelBtn,
	getAddWorkspaceCreateBtn,
	getAddWorkspaceCurrencyInput,
	getAddWorkspaceDialog,
	getAddWorkspaceNameInput,
	getAddWorkspaceNameInputClearBtn,
	getConfirmExitBtn,
	getCurrencySettingsBaseCurrencyInput,
	getCurrencySettingsBaseCurrencyOptions,
	getCurrencySettingsShowBaseCurrencyCheckbox,
	getCurrencySettingsTitle,
	getEditWorkspaceCancelBtn,
	getEditWorkspaceDialog,
	getEditWorkspaceNameInput,
	getEditWorkspaceNameInputClearBtn,
	getEditWorkspaceSaveBtn,
	getWorkspaceAddBtn,
	getWorkspaceAddMembers,
	getWorkspaceCurrentTag,
	getWorkspaceDeleteBtn,
	getWorkspaceDetail,
	getWorkspaceEditBtns,
	getWorkspaceKickMember,
	getWorkspaceLeaveBtn,
	getWorkspaceLeaveBtns,
	getWorkspaceMembers,
	getWorkspaceNames,
	getWorkspaceRows,
	getWorkspacesTitle,
} from '../locators/workspaces-locators';
import { createWorkspace } from '../utils/create-workspace.utils';
import { setupMultipleWorkspacesForMultipleAccounts, setupWorkspaceSettings } from '../utils/setup-workspace.utils';

test.describe('Workspaces - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceSettings(page, context);
	});

	test('should display workspaces section', async ({ page }) => {
		await expect(getWorkspacesTitle(page)).toBeVisible();
	});

	test('should display at least 1 workspace with current tag and delete button', async ({ page }) => {
		const firstRow = getWorkspaceRows(page).first();
		await expect(firstRow).toBeVisible();
		await expect(getWorkspaceCurrentTag(firstRow)).toBeVisible();
		await expect(getWorkspaceDeleteBtn(firstRow)).toBeVisible();
	});

	test('should display add workspace button', async ({ page }) => {
		await expect(getWorkspaceAddBtn(page)).toBeVisible();
	});

	test('should display currency settings section', async ({ page }) => {
		await expect(getCurrencySettingsTitle(page)).toBeVisible();
	});

	test('should display currency select menu', async ({ page }) => {
		await expect(getCurrencySettingsBaseCurrencyInput(page)).toBeVisible();
		await getCurrencySettingsBaseCurrencyInput(page).click();
		await expect(getCurrencySettingsBaseCurrencyOptions(page).first()).toBeVisible();
	});

	test('should display show base currency checkbox', async ({ page }) => {
		await expect(getCurrencySettingsShowBaseCurrencyCheckbox(page)).toBeVisible();
	});
});

// Workspaces - Your workspaces list
test.describe('Workspaces - Your workspaces list', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceSettings(page, context);
		await createWorkspace(page);
	});

	test('should display 2 rows when 2 workspaces exist', async ({ page }) => {
		await expect(getWorkspaceRows(page)).toHaveCount(2);
	});

	test('should expand on click and show details', async ({ page }) => {
		const firstRow = getWorkspaceRows(page).first();
		firstRow.click();
		await expect(getWorkspaceDetail(firstRow)).toBeVisible();
	});
});

// Workspaces - details
test.describe('Workspaces - details', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupMultipleWorkspacesForMultipleAccounts(page, context, 'details1', 'details2');
	});

	test('should show at least 2 members with different icons', async ({ page }) => {
		await getWorkspaceRows(page).first().click();
		await expect(getWorkspaceMembers(page)).toHaveCount(2);
	});
});

// Workspaces - owner - detail actions
test.describe('Workspaces - owner - detail actions', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	let name1 = ``;
	let name2 = ``;

	test.beforeEach(async ({ page, context }) => {
		const date = Date.now();
		name1 = `${date}1`;
		name2 = `${date}2`;

		await setupMultipleWorkspacesForMultipleAccounts(page, context, name1, name2);
	});

	test('should show action buttons', async ({ page }) => {
		const name = getWorkspaceNames(page).filter({ hasText: name1 });
		name.click();
		await page.waitForTimeout(250);
		await expect(getWorkspaceAddMembers(page).first()).toBeVisible();
		await expect(getWorkspaceEditBtns(page).first()).toBeVisible();
	});

	test('should show kick next to member', async ({ page }) => {
		await getWorkspaceRows(page).filter({ hasText: 'workspace-2' }).click();
		const member = getWorkspaceMembers(page).filter({ hasText: name2 });
		await expect(getWorkspaceKickMember(member)).toBeVisible();
	});

	test('should show delete btn in workspace title', async ({ page }) => {
		const name = getWorkspaceNames(page).filter({ hasText: name1 });
		name.click();
		await page.waitForTimeout(150);
		await expect(getWorkspaceDeleteBtn(getWorkspaceRows(page).first())).toBeVisible();
	});
});

// Workspaces - member - detail actions
test.describe('Workspaces - member - detail actions', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	let name1 = ``;
	let name2 = ``;

	test.beforeEach(async ({ page, context }) => {
		const date = Date.now();
		name1 = `${date}1`;
		name2 = `${date}2`;

		await setupMultipleWorkspacesForMultipleAccounts(page, context, name1, name2);
	});

	test('should not show action buttons', async ({ page }) => {
		const name = getWorkspaceNames(page).filter({ hasText: 'workspace-3' });
		name.click();
		await page.waitForTimeout(250);
		await expect(getWorkspaceAddMembers(page).last()).not.toBeVisible();
		await expect(getWorkspaceEditBtns(page).last()).not.toBeVisible();
	});

	test('should show leave btn in workspace title', async ({ page }) => {
		const name = getWorkspaceNames(page).filter({ hasText: 'workspace-3' });
		name.click();
		await expect(getWorkspaceLeaveBtn(getWorkspaceRows(page).last())).toBeVisible();
	});
});

// Workspaces - create workspace dialog
test.describe('Workspaces - create workspace dialog', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceSettings(page, context);
		await getWorkspaceAddBtn(page).click();
		await expect(getAddWorkspaceDialog(page)).toBeVisible();
	});

	test('should show name input', async ({ page }) => {
		await expect(getAddWorkspaceNameInput(page)).toBeVisible();
	});

	test('should show base currency input', async ({ page }) => {
		await expect(getAddWorkspaceCurrencyInput(page)).toBeVisible();
	});

	test('should name clear button clear input value', async ({ page }) => {
		await fillAndBlur(getAddWorkspaceNameInput(page), 'asdf');
		await expect(getAddWorkspaceNameInput(page)).toHaveValue('asdf');
		await getAddWorkspaceNameInputClearBtn(page).click();
		await expect(getAddWorkspaceNameInput(page)).toHaveValue('');
	});

	test('should show name required error', async ({ page }) => {
		await getAddWorkspaceNameInput(page).click();
		await getAddWorkspaceNameInput(page).blur();
		await expect(page.getByText(workspaceData.errors.required)).toBeVisible();
	});

	test('should show name maxlength error', async ({ page }) => {
		await fillAndBlur(
			getAddWorkspaceNameInput(page),
			'a'.repeat(Number(workspaceData.validators.nameMaxLength) + 1),
		);
		await expect(page.getByText(workspaceData.errors.maxLength)).toBeVisible();
	});

	test('should create button be disabled on init', async ({ page }) => {
		await expect(getAddWorkspaceCreateBtn(page).locator('button')).toBeDisabled();
	});

	test('should switch to newly created workspace', async ({ page }) => {
		await getAddWorkspaceCancelBtn(page).click();
		const initialWorkspaceName = await getProfileWorkspaceName(page).textContent();
		await createWorkspace(page);
		await expect(getProfileWorkspaceName(page)).not.toHaveText(initialWorkspaceName!);
	});

	test('should should show newly created workspace in workspace lists', async ({ page }) => {
		await getAddWorkspaceCancelBtn(page).click();
		await expect(getWorkspaceRows(page)).toHaveCount(1);
		await createWorkspace(page);
		await expect(getWorkspaceRows(page)).toHaveCount(2);
	});

	test('should close dialog when clicking cancel button', async ({ page }) => {
		await getAddWorkspaceCancelBtn(page).click();
		await expect(getAddWorkspaceDialog(page)).not.toBeVisible();
	});
});

// Workspaces - add member dialog
test.describe('Workspaces - add member dialog', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	let name1 = ``;
	let name2 = ``;

	test.beforeEach(async ({ page, context }) => {
		const date = Date.now();
		name1 = `${date}1`;
		name2 = `${date}2`;

		await setupMultipleWorkspacesForMultipleAccounts(page, context, name1, name2);
		await getWorkspaceNames(page).first().click();
		await getWorkspaceAddMembers(page).first().click();
		await expect(getAddMemberDialog(page)).toBeVisible();
	});

	test('should show email input', async ({ page }) => {
		await expect(getAddMemberEmailInput(page)).toBeVisible();
	});

	test('should email clear button clear input value', async ({ page }) => {
		await fillAndBlur(getAddMemberEmailInput(page), 'asdf');
		await expect(getAddMemberEmailInput(page)).toHaveValue('asdf');
		await getAddMemberEmailInputClearBtn(page).click();
		await expect(getAddMemberEmailInput(page)).toHaveValue('');
	});

	test('should show email required error', async ({ page }) => {
		await getAddMemberEmailInput(page).click();
		await getAddMemberEmailInput(page).blur();
		await expect(page.getByText(workspaceData.errors.required)).toBeVisible();
	});

	test('should show email format error', async ({ page }) => {
		await fillAndBlur(getAddMemberEmailInput(page), workspaceData.validators.invalidEmailFormat);
		await expect(page.getByText(workspaceData.errors.email)).toBeVisible();
	});

	test('should add be disabled on init', async ({ page }) => {
		await expect(getAddMemberAddBtn(page).locator('button')).toBeDisabled();
	});

	test('should show member in workspace', async ({ page }) => {
		await fillAndBlur(getAddMemberEmailInput(page), workspaceData.addMember.success.email);
		await getAddMemberAddBtn(page).click();
		await expect(getWorkspaceMembers(page).filter({ hasText: workspaceData.addMember.success.name })).toBeVisible();
	});

	test('should show close dialog and show error snackbar when using non-exising user email', async ({ page }) => {
		await fillAndBlur(getAddMemberEmailInput(page), workspaceData.addMember.nonExisting);
		await getAddMemberAddBtn(page).click();
		await expect(getErrorSnackbar(page)).toBeVisible();
	});

	test('should close dialog when clicking cancel button', async ({ page }) => {
		await expect(getAddMemberDialog(page)).toBeVisible();
		await getAddMemberCloseBtn(page).click();
		await expect(getAddMemberDialog(page)).not.toBeVisible();
	});
});

// Workspaces - edit workspace dialog
test.describe('Workspaces - edit worksapce dialog', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	let name1 = ``;
	let name2 = ``;

	test.beforeEach(async ({ page, context }) => {
		const date = Date.now();
		name1 = `${date}1`;
		name2 = `${date}2`;

		await setupMultipleWorkspacesForMultipleAccounts(page, context, name1, name2);
		await getWorkspaceNames(page).last().click();
		await getWorkspaceLeaveBtns(page).last().click();
		await getConfirmExitBtn(page, 'Leave').last().click();
		await page.waitForTimeout(250);
		await getWorkspaceNames(page).last().click();
		await getWorkspaceEditBtns(page).last().click();
		await expect(getEditWorkspaceDialog(page)).toBeVisible();
	});

	test('should show name input', async ({ page }) => {
		await expect(getEditWorkspaceNameInput(page)).toBeVisible();
	});

	test('should name clear button clear input value', async ({ page }) => {
		await fillAndBlur(getEditWorkspaceNameInput(page), 'asdf');
		await expect(getEditWorkspaceNameInput(page)).toHaveValue('asdf');
		await getEditWorkspaceNameInputClearBtn(page).click();
		await expect(getEditWorkspaceNameInput(page)).toHaveValue('');
	});

	test('should show name required error', async ({ page }) => {
		await getEditWorkspaceNameInput(page).click();
		await getEditWorkspaceNameInputClearBtn(page).click();
		await getEditWorkspaceNameInput(page).blur();
		await expect(page.getByText(workspaceData.errors.required)).toBeVisible();
	});

	test('should show name maxlength error', async ({ page }) => {
		await fillAndBlur(
			getEditWorkspaceNameInput(page),
			'a'.repeat(Number(workspaceData.validators.nameMaxLength) + 1),
		);
		await expect(page.getByText(workspaceData.errors.maxLength)).toBeVisible();
	});

	test('should save be enabled on init', async ({ page }) => {
		await expect(getEditWorkspaceSaveBtn(page).locator('button')).toBeEnabled();
	});

	test("should name be prefilled with workspace's name", async ({ page }) => {
		await expect(getEditWorkspaceNameInput(page)).toHaveValue('workspace-2');
	});

	test("should updated name show in current user's list", async ({ page }) => {
		await fillAndBlur(getEditWorkspaceNameInput(page), workspaceData.editWorkspace.newName);
		await getEditWorkspaceSaveBtn(page).click();
		await expect(getEditWorkspaceDialog(page)).not.toBeVisible();
		await expect(getWorkspaceRows(page).filter({ hasText: workspaceData.editWorkspace.newName })).toBeVisible();
	});

	test("should updated name show in other user's list", async ({ page }) => {
		await fillAndBlur(getEditWorkspaceNameInput(page), workspaceData.editWorkspace.newName);
		await getEditWorkspaceSaveBtn(page).click();
		await page.waitForTimeout(250);
		await expect(getEditWorkspaceDialog(page)).not.toBeVisible();
		await getProfileDialogCloseBtn(page).click();
		await getLogoutBtn(page).click();
		await attemptLoginWithEmail(page, `${name2}@exence.com`);
		await openProfileDialog(page);
		await getProfileTabWorkspaceSettings(page).click();
		await expect(getWorkspaceRows(page).filter({ hasText: 'workspace-2' })).not.toBeVisible();
		await expect(getWorkspaceRows(page).filter({ hasText: workspaceData.editWorkspace.newName })).toBeVisible();
	});

	test('should close dialog when clicking cancel button', async ({ page }) => {
		await expect(getEditWorkspaceDialog(page)).toBeVisible();
		await getEditWorkspaceCancelBtn(page).click();
		await expect(getEditWorkspaceDialog(page)).not.toBeVisible();
	});
});

// Workspaces - delete workspace
test.describe('Workspaces - delete workspace', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceSettings(page, context);
	});

	test('should show confirm delete dialog on delete click', async ({ page }) => {
		await createWorkspace(page);
		const row = getWorkspaceRows(page).first();
		row.click();
		await page.waitForTimeout(250);
		await getWorkspaceDeleteBtn(row).click();
		await expect(getConfirmExitBtn(page, 'Delete')).toBeVisible();
	});

	test('should remove deleted workspace from workspace list', async ({ page }) => {
		await createWorkspace(page);
		const row = getWorkspaceRows(page).first();
		row.click();
		await page.waitForTimeout(250);
		await getWorkspaceDeleteBtn(row).click();
		await getConfirmExitBtn(page, 'Delete').click();
		await expect(getWorkspaceRows(page)).toHaveCount(1);
	});
});

// Workspaces - leave workspace
test.describe('Workspaces - leave workspace', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	let name1 = ``;
	let name2 = ``;

	test.beforeEach(async ({ page, context }) => {
		const date = Date.now();
		name1 = `${date}1`;
		name2 = `${date}2`;

		await setupMultipleWorkspacesForMultipleAccounts(page, context, name1, name2);
	});

	test('should show confirm leave dialog on leave click', async ({ page }) => {
		const row = getWorkspaceRows(page).last();
		row.click();
		await getWorkspaceLeaveBtn(row).click();
		await expect(getConfirmExitBtn(page, 'Leave')).toBeVisible();
	});

	test('should remove left workspace from workspace list', async ({ page }) => {
		await expect(getWorkspaceRows(page)).toHaveCount(3);
		const row = getWorkspaceRows(page).last();
		row.click();
		await getWorkspaceLeaveBtn(row).click();
		await getConfirmExitBtn(page, 'Leave').click();
		await expect(getWorkspaceRows(page)).toHaveCount(2);
	});

	test("should remove left user from workspace details in other user's workspace list", async ({ page }) => {
		const row = getWorkspaceRows(page).last();
		row.click();
		await getWorkspaceLeaveBtn(row).click();
		await getConfirmExitBtn(page, 'Leave').click();
		await expect(getConfirmExitBtn(page, 'Leave')).toBeVisible();
		await page.waitForTimeout(250);
		await getProfileDialogCloseBtn(page).click();
		await getLogoutBtn(page).click();
		await attemptLoginWithEmail(page, `${name2}@exence.com`);
		await openProfileDialog(page);
		await getProfileTabWorkspaceSettings(page).click();
		const lastRow = getWorkspaceRows(page).last();
		lastRow.click();
		await expect(getWorkspaceMembers(page)).toHaveCount(2);
	});
});

// Workspaces - kick workspace
test.describe('Workspaces - kick workspace', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	let name1 = ``;
	let name2 = ``;

	test.beforeEach(async ({ page, context }) => {
		const date = Date.now();
		name1 = `${date}1`;
		name2 = `${date}2`;

		await setupMultipleWorkspacesForMultipleAccounts(page, context, name1, name2);
	});

	test('should show confirm kick dialog on kick click', async ({ page }) => {
		const row = getWorkspaceRows(page).last();
		row.click();
		await getWorkspaceLeaveBtn(row).click();
		await getConfirmExitBtn(page, 'Leave').click();
		await page.waitForTimeout(150);
		const lastRow = getWorkspaceRows(page).last();
		lastRow.click();
		await getWorkspaceKickMember(lastRow).click();
		await expect(getConfirmExitBtn(page, 'Kick')).toBeVisible();
	});

	test('should remove kicked member from workspace member list', async ({ page }) => {
		const row = getWorkspaceRows(page).last();
		row.click();
		await getWorkspaceLeaveBtn(row).click();
		await getConfirmExitBtn(page, 'Leave').click();
		await page.waitForTimeout(150);
		const lastRow = getWorkspaceRows(page).last();
		lastRow.click();
		await getWorkspaceKickMember(lastRow).click();
		await getConfirmExitBtn(page, 'Kick').click();
		lastRow.click();
		await expect(getWorkspaceMembers(page)).toHaveCount(1);
	});

	test("should remove workspace from kicked user's workspace list", async ({ page }) => {
		const row = getWorkspaceRows(page).last();
		row.click();
		await getWorkspaceLeaveBtn(row).click();
		await getConfirmExitBtn(page, 'Leave').click();
		await expect(getConfirmExitBtn(page, 'Leave')).toBeVisible();
		await page.waitForTimeout(250);
		const lastRow = getWorkspaceRows(page).last();
		lastRow.click();
		await getWorkspaceKickMember(lastRow).click();
		await getConfirmExitBtn(page, 'Kick').click();
		await page.waitForTimeout(250);
		await getProfileDialogCloseBtn(page).click();
		await getLogoutBtn(page).click();
		await attemptLoginWithEmail(page, `${name2}@exence.com`);
		await openProfileDialog(page);
		await getProfileTabWorkspaceSettings(page).click();
		await expect(getWorkspaceRows(page).filter({ hasText: 'workspace-2' })).not.toBeVisible();
	});
});

// Currency settings
test.describe('Currency settings - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceSettings(page, context);
	});

	test('should show 9 currencies in base currency select', async ({ page }) => {
		await getCurrencySettingsBaseCurrencyInput(page).click();
		await expect(getCurrencySettingsBaseCurrencyOptions(page)).toHaveCount(9);
	});

	test('should show spinner on save', async ({ page }) => {
		await getCurrencySettingsBaseCurrencyInput(page).click();
		await getCurrencySettingsBaseCurrencyOptions(page).filter({ hasText: 'USD' }).click();
		await getWorkspaceSettingsSaveBtn(page).click();
		await expect(getWorkspaceSettingsSavingSpinner(page)).toBeVisible();
	});

	test('should check show base currency checkbox', async ({ page }) => {
		await getShowBaseCurrencyCheckbox(page).click();
		getWorkspaceSettingsSaveBtn(page).click();
		const request1 = await page.waitForRequest(req => req.method() === 'PATCH');
		expect(request1.url()).toContain('/api/workspaces/settings');
		expect(request1.method()).toBe('PATCH');
		expect(request1.postDataJSON().showBaseCurrency).toBe(true);

		await getShowBaseCurrencyCheckbox(page).click();
		getWorkspaceSettingsSaveBtn(page).click();
		const request2 = await page.waitForRequest(req => req.method() === 'PATCH');
		expect(request2.url()).toContain('/api/workspaces/settings');
		expect(request2.method()).toBe('PATCH');
		expect(request2.postDataJSON().showBaseCurrency).toBe(false);
	});
});
