import { expect, test } from '@playwright/test';
import { setupAdmin } from '../utils/setup-admin.utils';
import {
	getAddPathChipBtn,
	getAddPathDialog,
	getAddPathInput,
	getAdminCharts,
	getAdminTabByIndex,
	getAdminTabGroup,
	getAdminTabIcon,
	getAmountStepperByLabel,
	getAmountStepperError,
	getAmountStepperInput,
	getAuditChangeTypeSelect,
	getAuditDataRows,
	getAuditFilterOption,
	getAuditRowByAction,
	getBroadcastConfirmSendBtn,
	getBroadcastContentInput,
	getBroadcastFormTextarea,
	getCancelSystemSettingsBtn,
	getCardGrid,
	getChartGrid,
	getChartWidgets,
	getClearBroadcastBtn,
	getConfirmDialog,
	getCreateAccountBtn,
	getDateColumnHeader,
	getDialogAddBtn,
	getDialogCancelBtn,
	getEmailBroadcastSection,
	getExpandedDetails,
	getFirstRemovableChip,
	getInfoBtnInCard,
	getLeaderboardByTitle,
	getPageTransactionList,
	getPathChipByText,
	getPathChips,
	getRegConfirmClearBtn,
	getRegConfirmInput,
	getRegConfirmPasswordError,
	getRegEmailInput,
	getRegFieldError,
	getRegFormFieldClearBtn,
	getRegPasswordClearBtn,
	getRegPasswordError,
	getRegPasswordInput,
	getRegUsernameInput,
	getRegWorkspaceInput,
	getRegistrationSection,
	getRemoveBtnOnChip,
	getSaveSystemSettingsBtn,
	getSectionHeading,
	getSendBtn,
	getShowPasswordBtn,
	getSlideToggleInCard,
	getSlideToggleSwitch,
	getStatCards,
	getSubjectClearBtn,
	getSubjectInput,
	getSystemSettingsSection,
	getToggleCardByLabel,
	getToggleCards,
	getTooltipSurface,
	getTransactionListFirstRow,
	getTransactionRowMenuTrigger,
	getUpdatedTransactionAuditRow,
} from '../locators/admin-locators';
import { getFilterBadge, getFilterMenuBtn } from '../../transactions/locators/transactions-locators';
import { getSuccessSnackbar } from '../../snackbar/locators/snackbar-locators';
import { createUniqueName, fillAndBlur } from '../../form/utils/form-utils';
import { getRowActionEdit } from '../../transaction/locators/transaction-list-locators';
import {
	getEditSaveBtn,
	getEditSaveBtnInner,
	getEditTitleInput,
	getEditTransactionDialog,
} from '../../transaction/edit-transaction-dialog/locators/edit-transaction-dialog-locators';
import adminData from '../data/admin.data.json';

// Tab layout
test.describe('Admin — tab layout on large screens', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
	});

	test('should display tab group', async ({ page }) => {
		await expect(getAdminTabGroup(page)).toBeVisible();
	});

	test('should show icon and text for Statistics tab', async ({ page }) => {
		const tab = getAdminTabByIndex(page, 0);
		await expect(getAdminTabIcon(tab)).toBeVisible();
		await expect(tab).toContainText(adminData.tabs.statistics);
	});

	test('should show icon and text for Logs tab', async ({ page }) => {
		const tab = getAdminTabByIndex(page, 1);
		await expect(getAdminTabIcon(tab)).toBeVisible();
		await expect(tab).toContainText(adminData.tabs.logs);
	});

	test('should show icon and text for Configs tab', async ({ page }) => {
		const tab = getAdminTabByIndex(page, 2);
		await expect(getAdminTabIcon(tab)).toBeVisible();
		await expect(tab).toContainText(adminData.tabs.configs);
	});
});

test.describe('Admin — tab layout on small screens', () => {
	test.use({ viewport: { width: 500, height: 700 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
	});

	test('should show only icon (no text) for Statistics tab on small screens', async ({ page }) => {
		const tab = getAdminTabByIndex(page, 0);
		await expect(getAdminTabIcon(tab)).toBeVisible();
		await expect(tab).not.toContainText(adminData.tabs.statistics);
	});

	test('should show only icon (no text) for Logs tab on small screens', async ({ page }) => {
		const tab = getAdminTabByIndex(page, 1);
		await expect(getAdminTabIcon(tab)).toBeVisible();
		await expect(tab).not.toContainText(adminData.tabs.logs);
	});

	test('should show only icon (no text) for Configs tab on small screens', async ({ page }) => {
		const tab = getAdminTabByIndex(page, 2);
		await expect(getAdminTabIcon(tab)).toBeVisible();
		await expect(tab).not.toContainText(adminData.tabs.configs);
	});
});

// Statistics tab
test.describe('Admin — Statistics tab', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
	});

	test('should display 3 stat cards', async ({ page }) => {
		await expect(getStatCards(page)).toHaveCount(1);
		await expect(getLeaderboardByTitle(page, adminData.statCards.databaseGrowth)).toBeVisible();
		await expect(getLeaderboardByTitle(page, adminData.statCards.topUsers)).toBeVisible();
		await expect(getSectionHeading(page, adminData.statCards.emailVerificationRate)).toBeVisible();
	});

	test('should display all 6 chart widgets', async ({ page }) => {
		await expect(getAdminCharts(page)).toHaveCount(6);
		await expect(getChartWidgets(page)).toHaveCount(6);
		for (let i = 0; i < 6; i++) {
			await expect(getChartWidgets(page).nth(i)).toBeVisible();
		}
	});

	test('should display all 6 chart types (one per adminWidgetType)', async ({ page }) => {
		await expect(getChartWidgets(page)).toHaveCount(6);
		await expect(getAdminCharts(page)).toHaveCount(6);
		for (let i = 0; i < 6; i++) {
			await expect(getAdminCharts(page).nth(i)).toBeVisible();
		}
	});
});

test.describe('Admin — Statistics tab — card grid on mobile', () => {
	test.use({ viewport: { width: 400, height: 800 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
	});

	test('should have cards in a single scrollable row on mobile', async ({ page }) => {
		const cardGrid = getCardGrid(page);
		await expect(cardGrid).toBeVisible();
		const overflowX = await cardGrid.evaluate(el => getComputedStyle(el).overflowX);
		expect(overflowX).toBe('auto');
		await expect(getStatCards(page)).toHaveCount(1);
		await expect(getLeaderboardByTitle(page, adminData.statCards.databaseGrowth)).toBeAttached();
		await expect(getLeaderboardByTitle(page, adminData.statCards.topUsers)).toBeAttached();
	});
});

test.describe('Admin — Statistics tab — chart grid single column', () => {
	test.use({ viewport: { width: 600, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
	});

	test('should display chart grid in 1 column below md breakpoint', async ({ page }) => {
		const chartGrid = getChartGrid(page);
		await expect(chartGrid).toBeVisible();
		const columns = await chartGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
		expect(columns.trim().split(/\s+/).length).toBe(1);
	});
});

test.describe('Admin — Statistics tab — chart grid two columns', () => {
	test.use({ viewport: { width: 900, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
	});

	test('should display chart grid in 2 columns at or above md breakpoint', async ({ page }) => {
		const chartGrid = getChartGrid(page);
		await expect(chartGrid).toBeVisible();
		const columns = await chartGrid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
		expect(columns.trim().split(/\s+/).length).toBe(2);
	});
});

// Logs tab
test.describe('Admin — Logs tab', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 1).click();
	});

	test('should display filter menu button', async ({ page }) => {
		await expect(getFilterMenuBtn(page)).toBeVisible();
	});

	test('should load audit log list with data rows', async ({ page }) => {
		await expect(getAuditDataRows(page).first()).toBeVisible();
	});

	test('should show mat-badge on filter button when filter is applied', async ({ page }) => {
		await expect(getFilterBadge(page)).not.toBeVisible();
		await getFilterMenuBtn(page).click();
		await getAuditChangeTypeSelect(page).click();
		await getAuditFilterOption(page, adminData.auditLog.createdLabel).click();
		await expect(getFilterBadge(page)).toBeVisible();
		await expect(getFilterBadge(page)).toContainText(adminData.auditLog.filterBadgeCount);
	});

	test('should update list when change type filter is applied and show badge', async ({ page }) => {
		await expect(getAuditDataRows(page).first()).toBeVisible();
		await getFilterMenuBtn(page).click();
		await getAuditChangeTypeSelect(page).click();
		await getAuditFilterOption(page, adminData.auditLog.createdLabel).click();
		await page.waitForResponse(resp => resp.url().includes('/audit-logs') && resp.status() === 200);
		await expect(getAuditDataRows(page).first()).toBeVisible();
		await expect(getFilterBadge(page)).toContainText(adminData.auditLog.filterBadgeCount);
	});

	test('should expand rows to show audit details', async ({ page }) => {
		const firstRow = getAuditDataRows(page).first();
		await firstRow.click();
		await expect(getExpandedDetails(page)).toBeVisible();
	});

	test('should show date in expanded detail for Created rows', async ({ page }) => {
		const createdRow = getAuditRowByAction(page, adminData.auditLog.createdLabel);
		await createdRow.click();
		const details = getExpandedDetails(page);
		await expect(details).toBeVisible();
		await expect(details).toContainText('/');
	});

	test('should show date in expanded detail for Deleted rows', async ({ page }) => {
		const deletedRow = getAuditRowByAction(page, adminData.auditLog.deletedLabel);
		if (!(await deletedRow.isVisible())) {
			test.skip();
			return;
		}
		await deletedRow.click();
		const details = getExpandedDetails(page);
		await expect(details).toBeVisible();
		await expect(details).toContainText('/');
	});

	test('should show field changes with arrow in expanded detail for Updated rows', async ({ page }) => {
		const updatedRow = getAuditRowByAction(page, adminData.auditLog.updatedLabel);
		if (!(await updatedRow.isVisible())) {
			test.skip();
			return;
		}
		await updatedRow.click();
		const details = getExpandedDetails(page);
		await expect(details).toBeVisible();
		await expect(details).toContainText(adminData.auditLog.changeArrow);
	});
});

test.describe('Admin — Logs tab — date column visibility', () => {
	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 1).click();
	});

	test('should hide Date column below 992px', async ({ page }) => {
		await page.setViewportSize({ width: 800, height: 900 });
		await expect(getDateColumnHeader(page)).not.toBeVisible();
	});

	test('should show Date column at 992px and above', async ({ page }) => {
		await page.setViewportSize({ width: 1400, height: 900 });
		await expect(getDateColumnHeader(page)).toBeVisible();
	});
});

test.describe('Admin — Logs tab — audit log for modified transaction', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test('should show updated transaction fields in audit log after editing', async ({ page, context }) => {
		await setupAdmin(page, context);

		await page.goto('/transactions', { waitUntil: 'domcontentloaded' });

		const firstRow = getTransactionListFirstRow(page);
		await expect(firstRow).toBeVisible();
		await firstRow.click();
		await getTransactionRowMenuTrigger(firstRow).click();
		await getRowActionEdit(page).click();

		await expect(getEditTransactionDialog(page)).toBeVisible();
		const editInput = getEditTitleInput(page);
		const originalTitle = await editInput.inputValue();
		const newTitle = `e2e_${createUniqueName()}`;

		await editInput.clear();
		await fillAndBlur(editInput, newTitle);
		await expect(getEditSaveBtnInner(page)).not.toBeDisabled();
		await getEditSaveBtn(page).click();
		await expect(getEditTransactionDialog(page)).not.toBeVisible();

		await page.goto('/admin', { waitUntil: 'domcontentloaded' });
		await getAdminTabByIndex(page, 1).click();

		await page.waitForResponse(resp => resp.url().includes('/audit-logs') && resp.status() === 200);
		await expect(getAuditDataRows(page).first()).toBeVisible();

		const updatedRow = getUpdatedTransactionAuditRow(
			page,
			adminData.auditLog.updatedLabel,
			adminData.auditLog.transactionLabel,
		);
		await expect(updatedRow).toBeVisible();
		await updatedRow.click();

		const details = getExpandedDetails(page);
		await expect(details).toBeVisible();
		await expect(details).toContainText(originalTitle);
		await expect(details).toContainText(adminData.auditLog.changeArrow);
		await expect(details).toContainText(newTitle);
	});
});

// Configs tab — System Settings
test.describe('Admin — Configs tab — sections', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 2).click();
	});

	test('should display System Settings section', async ({ page }) => {
		await expect(getSectionHeading(page, adminData.sections.systemSettings)).toBeVisible();
	});

	test('should display Create new Admin user section', async ({ page }) => {
		await expect(getSectionHeading(page, adminData.sections.createAdmin)).toBeVisible();
	});

	test('should display Broadcast Email section', async ({ page }) => {
		await expect(getSectionHeading(page, adminData.sections.broadcastEmail)).toBeVisible();
	});
});

test.describe('Admin — Configs tab — System Settings toggle cards', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 2).click();
		await expect(getSystemSettingsSection(page)).toBeVisible();
		await expect(getToggleCards(page).first()).toBeVisible();
	});

	test('should display 3 toggle cards', async ({ page }) => {
		await expect(getToggleCards(page)).toHaveCount(3);
	});

	test('should toggle the slide toggle when clicking the toggle card', async ({ page }) => {
		const card = getToggleCardByLabel(page, adminData.systemSettings.domainWhitelistLabel);
		const toggle = getSlideToggleInCard(card);
		const input = getSlideToggleSwitch(card);
		const before = await input.isChecked();
		await toggle.click();
		await expect(input).toBeChecked({ checked: !before });
	});

	test('should show tooltip when hovering info button', async ({ page }) => {
		const card = getToggleCards(page).first();
		const infoBtn = getInfoBtnInCard(card);
		await infoBtn.hover();
		await expect(getTooltipSurface(page)).toBeVisible();
	});
});

test.describe('Admin — Configs tab — System Settings amount steppers', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 2).click();
		await expect(getSystemSettingsSection(page)).toBeVisible();
		await expect(getToggleCards(page).first()).toBeVisible();
	});

	test('should show validation error when rate limiting cooldown is below minimum', async ({ page }) => {
		const stepper = getAmountStepperByLabel(page, adminData.systemSettings.cooldownLabel);
		const input = getAmountStepperInput(stepper);
		await input.fill('0');
		await input.blur();
		await expect(getAmountStepperError(stepper)).toBeVisible();
	});

	test('should not show error when rate limiting cooldown equals minimum', async ({ page }) => {
		const stepper = getAmountStepperByLabel(page, adminData.systemSettings.cooldownLabel);
		const input = getAmountStepperInput(stepper);
		await input.fill('1');
		await input.blur();
		await expect(getAmountStepperError(stepper)).not.toBeVisible();
	});

	test('should show validation error when password history count is below minimum', async ({ page }) => {
		const stepper = getAmountStepperByLabel(page, adminData.systemSettings.historyLabel);
		const input = getAmountStepperInput(stepper);
		await input.fill('-1');
		await input.blur();
		await expect(getAmountStepperError(stepper)).toBeVisible();
	});

	test('should accept 0 for password history count', async ({ page }) => {
		const stepper = getAmountStepperByLabel(page, adminData.systemSettings.historyLabel);
		const input = getAmountStepperInput(stepper);
		await input.fill('0');
		await input.blur();
		await expect(getAmountStepperError(stepper)).not.toBeVisible();
	});
});

test.describe('Admin — Configs tab — System Settings verification paths', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 2).click();
		await expect(getSystemSettingsSection(page)).toBeVisible();
		await expect(getToggleCards(page).first()).toBeVisible();
	});

	test('should remove a path chip when clicking its remove button', async ({ page }) => {
		const chips = getPathChips(page);
		const initialCount = await chips.count();
		if (initialCount <= 1) {
			test.skip();
			return;
		}
		const removableChip = getFirstRemovableChip(page);
		const removeBtn = getRemoveBtnOnChip(removableChip);
		await removeBtn.click();
		await expect(chips).toHaveCount(initialCount - 1);
	});

	test('should open add path dialog when clicking the Add chip', async ({ page }) => {
		await getAddPathChipBtn(page).click();
		await expect(getAddPathDialog(page)).toBeVisible();
	});

	test('should disable Add button in dialog when path input is empty', async ({ page }) => {
		await getAddPathChipBtn(page).click();
		await expect(getDialogAddBtn(page)).toBeDisabled();
	});

	test('should close dialog without adding chip on Cancel', async ({ page }) => {
		const chipsCountBefore = await getPathChips(page).count();
		await getAddPathChipBtn(page).click();
		await expect(getAddPathDialog(page)).toBeVisible();
		await getDialogCancelBtn(page).click();
		await expect(getAddPathDialog(page)).not.toBeVisible();
		await expect(getPathChips(page)).toHaveCount(chipsCountBefore);
	});

	test('should add new chip after submitting path in dialog', async ({ page }) => {
		const uniquePath = `/api/e2e-${createUniqueName()}`;
		const chipsCountBefore = await getPathChips(page).count();
		await getAddPathChipBtn(page).click();
		await fillAndBlur(getAddPathInput(page), uniquePath);
		await getDialogAddBtn(page).click();
		await expect(getAddPathDialog(page)).not.toBeVisible();
		await expect(getPathChips(page)).toHaveCount(chipsCountBefore + 1);
		await expect(getPathChipByText(page, uniquePath)).toBeVisible();
	});

	test('should revert all changes after clicking Cancel', async ({ page }) => {
		const uniquePath = `/api/e2e-cancel-${createUniqueName()}`;
		const card = getToggleCardByLabel(page, adminData.systemSettings.domainWhitelistLabel);
		const input = getSlideToggleSwitch(card);
		const initialChecked = await input.isChecked();

		await getSlideToggleInCard(card).click();
		await expect(input).toBeChecked({ checked: !initialChecked });

		await getAddPathChipBtn(page).click();
		await fillAndBlur(getAddPathInput(page), uniquePath);
		await getDialogAddBtn(page).click();
		await expect(getPathChipByText(page, uniquePath)).toBeVisible();

		await getCancelSystemSettingsBtn(page).click();
		await expect(getToggleCards(page).first()).toBeVisible();

		await expect(input).toBeChecked({ checked: initialChecked });
		await expect(getPathChipByText(page, uniquePath)).not.toBeVisible();
	});

	test('should show success snackbar after saving settings', async ({ page }) => {
		await getSaveSystemSettingsBtn(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();
	});
});

// Configs tab — Create Admin User
test.describe('Admin — Configs tab — Create Admin User validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 2).click();
		await expect(getRegistrationSection(page)).toBeVisible();
	});

	test('should show error when username is empty', async ({ page }) => {
		const input = getRegUsernameInput(page);
		await input.focus();
		await input.blur();
		await expect(getRegFieldError(page, adminData.registration.usernameLabel)).toBeVisible();
	});

	test('should show error when workspace name is empty', async ({ page }) => {
		const input = getRegWorkspaceInput(page);
		await input.focus();
		await input.blur();
		await expect(getRegFieldError(page, adminData.registration.workspaceLabel)).toBeVisible();
	});

	test('should show error when workspace name exceeds max length', async ({ page }) => {
		await fillAndBlur(getRegWorkspaceInput(page), 'a'.repeat(adminData.registration.longWorkspaceNameLength));
		await expect(getRegFieldError(page, adminData.registration.workspaceLabel)).toBeVisible();
	});

	test('should show error when email is empty', async ({ page }) => {
		const input = getRegEmailInput(page);
		await input.focus();
		await input.blur();
		await expect(getRegFieldError(page, adminData.registration.emailLabel)).toBeVisible();
	});

	test('should show error when email format is invalid', async ({ page }) => {
		await fillAndBlur(getRegEmailInput(page), adminData.registration.invalidEmail);
		await expect(getRegFieldError(page, adminData.registration.emailLabel)).toBeVisible();
	});

	test('should show error when password is empty', async ({ page }) => {
		const input = getRegPasswordInput(page);
		await input.focus();
		await input.blur();
		await expect(getRegPasswordError(page)).toBeVisible();
	});

	test('should show error when password does not meet complexity requirements', async ({ page }) => {
		await fillAndBlur(getRegPasswordInput(page), adminData.registration.weakPassword);
		await expect(getRegPasswordError(page)).toBeVisible();
	});

	test('should show error when confirm password does not match', async ({ page }) => {
		await fillAndBlur(getRegPasswordInput(page), adminData.registration.validPassword);
		await fillAndBlur(getRegConfirmInput(page), 'DifferentPass1!');
		await expect(getRegConfirmPasswordError(page)).toBeVisible();
	});
});

test.describe('Admin — Configs tab — Create Admin User clear buttons', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 2).click();
		await expect(getRegistrationSection(page)).toBeVisible();
	});

	test('should clear username input via clear button', async ({ page }) => {
		await fillAndBlur(getRegUsernameInput(page), adminData.registration.validUsername);
		await getRegFormFieldClearBtn(page, adminData.registration.usernameLabel).click();
		await expect(getRegUsernameInput(page)).toHaveValue('');
	});

	test('should clear workspace name input via clear button', async ({ page }) => {
		await fillAndBlur(getRegWorkspaceInput(page), adminData.registration.validWorkspace);
		await getRegFormFieldClearBtn(page, adminData.registration.workspaceLabel).click();
		await expect(getRegWorkspaceInput(page)).toHaveValue('');
	});

	test('should clear email input via clear button', async ({ page }) => {
		await fillAndBlur(getRegEmailInput(page), adminData.registration.validEmail);
		await getRegFormFieldClearBtn(page, adminData.registration.emailLabel).click();
		await expect(getRegEmailInput(page)).toHaveValue('');
	});

	test('should clear password input via clear button', async ({ page }) => {
		const input = getRegPasswordInput(page);
		await fillAndBlur(input, adminData.registration.validPassword);
		await getRegPasswordClearBtn(page).click();
		await expect(input).toHaveValue('');
	});

	test('should clear confirm password input via clear button', async ({ page }) => {
		const input = getRegConfirmInput(page);
		await fillAndBlur(input, adminData.registration.validPassword);
		await getRegConfirmClearBtn(page).click();
		await expect(input).toHaveValue('');
	});
});

test.describe('Admin — Configs tab — Create Admin User password toggle and submit', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 2).click();
		await expect(getRegistrationSection(page)).toBeVisible();
	});

	test('should toggle password visibility when clicking show-password button', async ({ page }) => {
		await fillAndBlur(getRegPasswordInput(page), adminData.registration.validPassword);
		const passwordField = getRegPasswordInput(page);
		await expect(passwordField).toHaveAttribute('type', 'password');
		await getShowPasswordBtn(page).click();
		await expect(passwordField).toHaveAttribute('type', 'text');
		await getShowPasswordBtn(page).click();
		await expect(passwordField).toHaveAttribute('type', 'password');
	});

	test('should reset form and show success snackbar after creating admin account', async ({ page }) => {
		const uniqueEmail = `e2e_admin_${createUniqueName()}@example.com`;
		await fillAndBlur(getRegUsernameInput(page), adminData.registration.validUsername);
		await fillAndBlur(getRegWorkspaceInput(page), adminData.registration.validWorkspace);
		await fillAndBlur(getRegEmailInput(page), uniqueEmail);
		await fillAndBlur(getRegPasswordInput(page), adminData.registration.validPassword);
		await fillAndBlur(getRegConfirmInput(page), adminData.registration.validPassword);
		await getCreateAccountBtn(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getRegUsernameInput(page)).toHaveValue('');
	});
});

// Configs tab — Broadcast Email
test.describe('Admin — Configs tab — Broadcast Email validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 2).click();
		await expect(getEmailBroadcastSection(page)).toBeVisible();
	});

	test('should disable Send button when subject is empty', async ({ page }) => {
		await expect(getSendBtn(page)).toBeDisabled();
	});

	test('should disable Send button when content exceeds max length', async ({ page }) => {
		await fillAndBlur(getSubjectInput(page), adminData.emailBroadcast.subject);
		const contentInput = getBroadcastContentInput(page);
		await contentInput.fill('a'.repeat(adminData.emailBroadcast.longContentLength));
		await contentInput.blur();
		await expect(getSendBtn(page)).toBeDisabled();
	});
});

test.describe('Admin — Configs tab — Broadcast Email clear buttons', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 2).click();
		await expect(getEmailBroadcastSection(page)).toBeVisible();
	});

	test('should clear only content when clicking the Clear button (subject remains)', async ({ page }) => {
		await fillAndBlur(getSubjectInput(page), adminData.emailBroadcast.subject);
		const contentInput = getBroadcastContentInput(page);
		await contentInput.fill(adminData.emailBroadcast.content);
		await getClearBroadcastBtn(page).click();
		await expect(getSubjectInput(page)).toHaveValue(adminData.emailBroadcast.subject);
		await expect(getBroadcastFormTextarea(page)).toHaveValue('');
	});

	test('should clear subject when clicking the subject clear button', async ({ page }) => {
		await fillAndBlur(getSubjectInput(page), adminData.emailBroadcast.subject);
		await getSubjectClearBtn(page).click();
		await expect(getSubjectInput(page)).toHaveValue('');
	});
});

test.describe('Admin — Configs tab — Broadcast Email send', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupAdmin(page, context);
		await getAdminTabByIndex(page, 2).click();
		await expect(getEmailBroadcastSection(page)).toBeVisible();
	});

	test('should show confirmation dialog when clicking Send', async ({ page }) => {
		await fillAndBlur(getSubjectInput(page), adminData.emailBroadcast.subject);
		const contentInput = getBroadcastContentInput(page);
		await contentInput.fill(adminData.emailBroadcast.content);
		await getSendBtn(page).click();
		await expect(getConfirmDialog(page)).toBeVisible();
		await expect(getConfirmDialog(page)).toContainText(adminData.emailBroadcast.confirmTitle);
	});

	test('should show success snackbar and reset form after confirming send', async ({ page }) => {
		await page.route('**/api/admin/email/broadcast', route => route.fulfill({ status: 200 }));
		await fillAndBlur(getSubjectInput(page), adminData.emailBroadcast.subject);
		const contentInput = getBroadcastContentInput(page);
		await contentInput.fill(adminData.emailBroadcast.content);
		await getSendBtn(page).click();
		await expect(getConfirmDialog(page)).toBeVisible();
		await getBroadcastConfirmSendBtn(page).click();
		await expect(getConfirmDialog(page)).not.toBeVisible();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getSubjectInput(page)).toHaveValue('');
	});
});
