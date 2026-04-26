import test, { expect } from '@playwright/test';
import authData from '../../../auth/data/auth.data.json';
import { fillAndBlur } from '../../../form/utils/form-utils';
import { getSuccessSnackbar } from '../../../snackbar/locators/snackbar-locators';
import { getProfileDialog, getProfileUsername } from '../../locators/profile-dialog-locators';
import profileInformationData from '../data/profile-data.data.json';
import {
	getChangePwdBtn,
	getChangePwdCancelBtn,
	getChangePwdConfirmPwdInput,
	getChangePwdNewPwdInput,
	getChangePwdOldPwdInput,
	getChangePwdSaveBtn,
	getChangePwdSaveBtnInner,
	getChangePwdTitle,
	getEditProfileDataCancelBtn,
	getEditProfileDataSaveBtn,
	getEditProfileDataSaveBtnInner,
	getProfileDataEditBtn,
	getProfileDataEmailInput,
	getProfileDataTitle,
	getProfileDataUsernameClearBtn,
	getProfileDataUsernameInput,
} from '../locators/profile-data-locators';
import { setupProfileData } from '../utils/setup-profile-data.util';

// Profile information - Profile data - structure
test.describe('Profile information - Profile data - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileData(page, context);
	});

	test('should show profile data section', async ({ page }) => {
		await expect(getProfileDataTitle(page)).toBeVisible();
		await expect(getProfileDataEditBtn(page)).toBeVisible();
		await expect(getProfileDataUsernameInput(page)).toBeVisible();
		await expect(getProfileDataEmailInput(page)).toBeVisible();
	});

	test('should fields be disabled on init', async ({ page }) => {
		await expect(getProfileDataUsernameInput(page)).toBeDisabled();
		await expect(getProfileDataEmailInput(page)).toBeDisabled();
	});
});

// Profile information - Profile data - actions
test.describe('Profile information - Profile data - actions', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileData(page, context);
	});

	test('should hide edit button and show cancel, save buttons', async ({ page }) => {
		await expect(getProfileDataEditBtn(page)).toBeVisible();
		await expect(getEditProfileDataSaveBtn(page)).not.toBeVisible();
		await expect(getEditProfileDataCancelBtn(page)).not.toBeVisible();
		await getProfileDataEditBtn(page).click();
		await expect(getProfileDataEditBtn(page)).not.toBeVisible();
		await expect(getEditProfileDataSaveBtn(page)).toBeVisible();
		await expect(getEditProfileDataCancelBtn(page)).toBeVisible();
		await expect(getEditProfileDataSaveBtn(page)).toBeEnabled();
	});

	test('should enable username and keep email disabled on clicking edit', async ({ page }) => {
		await expect(getProfileDataUsernameInput(page)).toBeDisabled();
		await expect(getProfileDataEmailInput(page)).toBeDisabled();
		await getProfileDataEditBtn(page).click();
		await expect(getProfileDataUsernameInput(page)).toBeEnabled();
		await expect(getProfileDataEmailInput(page)).toBeDisabled();
	});

	test('should cancel disabled username field, replace 2 action buttons with edit button', async ({ page }) => {
		await getProfileDataEditBtn(page).click();
		await expect(getProfileDataEditBtn(page)).not.toBeVisible();
		await expect(getEditProfileDataSaveBtn(page)).toBeVisible();
		await expect(getEditProfileDataCancelBtn(page)).toBeVisible();
		await expect(getProfileDataUsernameInput(page)).toBeEnabled();
		await getEditProfileDataSaveBtn(page).click();
		await expect(getProfileDataUsernameInput(page)).toBeDisabled();
		await expect(getEditProfileDataSaveBtn(page)).not.toBeVisible();
		await expect(getEditProfileDataCancelBtn(page)).not.toBeVisible();
		await expect(getProfileDataEditBtn(page)).toBeVisible();
	});

	test('should save show new username in profile dialog', async ({ page }) => {
		await expect(getProfileUsername(page)).not.toHaveText(profileInformationData.profileData.newUsername);
		await getProfileDataEditBtn(page).click();
		await getProfileDataUsernameClearBtn(page).click();
		await fillAndBlur(getProfileDataUsernameInput(page), profileInformationData.profileData.newUsername);
		await getEditProfileDataSaveBtn(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getProfileUsername(page)).toHaveText(profileInformationData.profileData.newUsername);
	});
});

// Profile information - Profile data - clear buttons
test.describe('Profile information - Profile data - clear buttons', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileData(page, context);
	});

	test('should not show username clear input button when not in editing mode', async ({ page }) => {
		await expect(getProfileDataEditBtn(page)).toBeVisible();
		await expect(getProfileDataUsernameClearBtn(page)).not.toBeVisible();
	});

	test('should show username clear input button when in editing mode', async ({ page }) => {
		await getProfileDataEditBtn(page).click();
		await expect(getEditProfileDataSaveBtn(page)).toBeVisible();
		await expect(getEditProfileDataCancelBtn(page)).toBeVisible();
		await expect(getProfileDataUsernameClearBtn(page)).toBeVisible();
	});

	test('should username clear button should remove value of input', async ({ page }) => {
		await getProfileDataEditBtn(page).click();
		await expect(getProfileDataUsernameInput(page)).not.toHaveValue('');
		await getProfileDataUsernameClearBtn(page).click();
		await expect(getProfileDataUsernameInput(page)).toHaveValue('');
	});
});

// Profile information - Profile data - validators
test.describe('Profile information - Profile data - validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileData(page, context);
	});

	test('should show username required error', async ({ page }) => {
		await getProfileDataEditBtn(page).click();
		await getProfileDataUsernameClearBtn(page).click();
		await getProfileDataUsernameInput(page).blur();
		await expect(page.getByText(profileInformationData.errors.required)).toBeVisible();
	});

	test('should show username maxlength error', async ({ page }) => {
		await getProfileDataEditBtn(page).click();
		await getProfileDataUsernameClearBtn(page).click();
		await fillAndBlur(
			getProfileDataUsernameInput(page),
			'a'.repeat(Number(profileInformationData.validators.userNameMaxLength) + 1),
		);
		await expect(page.getByText(profileInformationData.errors.maxLength)).toBeVisible();
	});

	test('should edit profile data save button be disabled when username required error shown', async ({ page }) => {
		await getProfileDataEditBtn(page).click();
		await expect(getEditProfileDataSaveBtnInner(page)).toBeEnabled();
		await getProfileDataUsernameClearBtn(page).click();
		await getProfileDataUsernameInput(page).blur();
		await expect(page.getByText(profileInformationData.errors.required)).toBeVisible();
		await expect(getEditProfileDataSaveBtnInner(page)).toBeDisabled();
	});

	test('should edit profile data save button be disabled when username maxlength error shown', async ({ page }) => {
		await getProfileDataEditBtn(page).click();
		await expect(getEditProfileDataSaveBtnInner(page)).toBeEnabled();
		await getProfileDataUsernameClearBtn(page).click();
		await fillAndBlur(
			getProfileDataUsernameInput(page),
			'a'.repeat(Number(profileInformationData.validators.userNameMaxLength) + 1),
		);
		await expect(page.getByText(profileInformationData.errors.maxLength)).toBeVisible();
		await expect(getEditProfileDataSaveBtnInner(page)).toBeDisabled();
	});
});

// Profile information - Change password - structure
test.describe('Profile information - Change password - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileData(page, context);
	});

	test('should show change password section', async ({ page }) => {
		await expect(getChangePwdTitle(page)).toBeVisible();
		await expect(getChangePwdBtn(page)).toBeVisible();
		await expect(getChangePwdOldPwdInput(page)).toBeVisible();
		await expect(getChangePwdNewPwdInput(page)).toBeVisible();
		await expect(getChangePwdConfirmPwdInput(page)).toBeVisible();
	});

	test('should fields be disabled on init', async ({ page }) => {
		await expect(getChangePwdOldPwdInput(page)).toBeDisabled();
		await expect(getChangePwdNewPwdInput(page)).toBeDisabled();
		await expect(getChangePwdConfirmPwdInput(page)).toBeDisabled();
	});
});

// Profile information - Change password - actions
test.describe('Profile information - Change password - actions', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileData(page, context);
	});

	test('should hide edit button and show cancel, save buttons', async ({ page }) => {
		await expect(getChangePwdBtn(page)).toBeVisible();
		await expect(getChangePwdCancelBtn(page)).not.toBeVisible();
		await expect(getChangePwdSaveBtn(page)).not.toBeVisible();
		await getChangePwdBtn(page).click();
		await expect(getChangePwdBtn(page)).not.toBeVisible();
		await expect(getChangePwdCancelBtn(page)).toBeVisible();
		await expect(getChangePwdSaveBtn(page)).toBeVisible();
		await expect(getChangePwdSaveBtnInner(page)).toBeDisabled();
	});

	test('should enable fields on clicking edit', async ({ page }) => {
		await expect(getChangePwdOldPwdInput(page)).toBeDisabled();
		await expect(getChangePwdNewPwdInput(page)).toBeDisabled();
		await expect(getChangePwdConfirmPwdInput(page)).toBeDisabled();
		await getChangePwdBtn(page).click();
		await expect(getChangePwdOldPwdInput(page)).toBeEnabled();
		await expect(getChangePwdNewPwdInput(page)).toBeEnabled();
		await expect(getChangePwdConfirmPwdInput(page)).toBeEnabled();
	});

	test('should cancel disabled username field, replace 2 action buttons with edit button', async ({ page }) => {
		await expect(getChangePwdBtn(page)).toBeVisible();
		await expect(getChangePwdSaveBtn(page)).not.toBeVisible();
		await expect(getChangePwdCancelBtn(page)).not.toBeVisible();
		await getChangePwdBtn(page).click();
		await expect(getChangePwdBtn(page)).not.toBeVisible();
		await expect(getChangePwdSaveBtn(page)).toBeVisible();
		await expect(getChangePwdCancelBtn(page)).toBeVisible();
	});

	test('should should show snackbar and close the dialog and show be navigated to /public/login', async ({
		page,
	}) => {
		await getChangePwdBtn(page).click();
		await fillAndBlur(getChangePwdOldPwdInput(page), authData.user.register.password);
		await fillAndBlur(getChangePwdNewPwdInput(page), profileInformationData.changePwd.new);
		await fillAndBlur(getChangePwdConfirmPwdInput(page), profileInformationData.changePwd.new);
		await getChangePwdSaveBtn(page).click();
		await expect(getProfileDialog(page)).not.toBeVisible();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(page).toHaveURL(/.*\/public\/login/);
	});
});

// Profile information - Change password - clear buttons
test.describe('Profile information - Change password - clear buttons', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileData(page, context);
	});

	test('should not show username clear input button when not in editing mode', async ({ page }) => {
		await expect(getProfileDataEditBtn(page)).toBeVisible();
		await expect(getProfileDataUsernameClearBtn(page)).not.toBeVisible();
	});

	test('should show username clear input button when in editing mode', async ({ page }) => {
		await getProfileDataEditBtn(page).click();
		await expect(getEditProfileDataSaveBtn(page)).toBeVisible();
		await expect(getEditProfileDataCancelBtn(page)).toBeVisible();
		await expect(getProfileDataUsernameClearBtn(page)).toBeVisible();
	});

	test('should username clear button should remove value of input', async ({ page }) => {
		await getProfileDataEditBtn(page).click();
		await expect(getProfileDataUsernameInput(page)).not.toHaveValue('');
		await getProfileDataUsernameClearBtn(page).click();
		await expect(getProfileDataUsernameInput(page)).toHaveValue('');
	});
});

// Profile information - Change password - validators
test.describe('Profile information - Change password - validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupProfileData(page, context);
	});

	test('should show password required error', async ({ page }) => {
		await getChangePwdBtn(page).click();
		await getChangePwdOldPwdInput(page).click();
		await getChangePwdOldPwdInput(page).blur();
		await expect(page.getByText(profileInformationData.errors.required)).toBeVisible();
	});

	test('should show password format error', async ({ page }) => {
		await getChangePwdBtn(page).click();
		await fillAndBlur(getChangePwdOldPwdInput(page), profileInformationData.changePwd.invalid);
		await expect(page.getByText(profileInformationData.errors.invalidPassword)).toBeVisible();
	});

	test('should show new password required error', async ({ page }) => {
		await getChangePwdBtn(page).click();
		await getChangePwdNewPwdInput(page).click();
		await getChangePwdNewPwdInput(page).blur();
		await expect(page.getByText(profileInformationData.errors.required)).toBeVisible();
	});

	test('should show new password format error', async ({ page }) => {
		await getChangePwdBtn(page).click();
		await fillAndBlur(getChangePwdNewPwdInput(page), profileInformationData.changePwd.invalid);
		await expect(page.getByText(profileInformationData.errors.invalidPassword)).toBeVisible();
	});

	test('should show confirm password required error', async ({ page }) => {
		await getChangePwdBtn(page).click();
		await getChangePwdConfirmPwdInput(page).click();
		await getChangePwdConfirmPwdInput(page).blur();
		await expect(page.getByText(profileInformationData.errors.required)).toBeVisible();
	});

	test('should show confirm password format error', async ({ page }) => {
		await getChangePwdBtn(page).click();
		await fillAndBlur(getChangePwdConfirmPwdInput(page), profileInformationData.changePwd.invalid);
		await expect(page.getByText(profileInformationData.errors.invalidPassword)).toBeVisible();
	});

	test('should show passwords do not match error', async ({ page }) => {
		await getChangePwdBtn(page).click();
		await fillAndBlur(getChangePwdNewPwdInput(page), profileInformationData.changePwd.new);
		await fillAndBlur(getChangePwdConfirmPwdInput(page), profileInformationData.changePwd.mismatch);
		await expect(page.getByText(profileInformationData.errors.passwordMismatch)).toBeVisible();
	});
});
// Profile data - Change password
// - Change password - fields enabled, save cancel showed, save disabled
// - Change password - usename field validators
// - Change password - usename field clear button
// - Change password - on save success snackbar
