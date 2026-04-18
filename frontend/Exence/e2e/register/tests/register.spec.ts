import { expect, test } from '@playwright/test';
import { fillAndBlur, getCurrentDate } from '../../form/utils/form-utils';
import { getErrorSnackbar, getSnackbarCloseBtn, getSuccessSnackbar } from '../../snackbar/locators/snackbar-locators';
import data from '../data/register.data.json';
import {
	getConfirmPasswordField,
	getConfirmPwdClearBtn,
	getConfirmPwdError,
	getCurrencySelect,
	getEmailClearBtn,
	getEmailError,
	getEmailField,
	getPasswordField,
	getPwdClearBtn,
	getPwdError,
	getRegisterBtn,
	getShowConfirmPwdBtn,
	getShowPwdBtn,
	getToLoginButton,
	getUsernameClearBtn,
	getUsernameError,
	getUsernameField,
	getWorkspaceNameClearBtn,
	getWorkspaceNameError,
	getWorkspaceNameField,
} from '../locators/register-locators';

test.describe('Register', () => {
	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies({ domain: 'localhost' }); // TODO change based on env

		await page.addInitScript(() => localStorage.setItem('language', 'en'));
		await page.goto('/public/register', { waitUntil: 'domcontentloaded' });

		await expect(getErrorSnackbar(page)).toBeVisible();
		await getSnackbarCloseBtn(page).click();
	});

	test('should display validators', async ({ page }) => {
		// Username required
		await getUsernameField(page).click();
		await getUsernameField(page).blur();
		await expect(getUsernameError(page)).toHaveText('Field required');

		// Username maxlength
		await getUsernameField(page).clear();
		await fillAndBlur(getUsernameField(page), data['incorrect'].usernameMaxLengthCharacter.repeat(256));
		await expect(getUsernameError(page)).toHaveText('Max length is 255!');

		// Username no errors
		await getUsernameField(page).clear();
		await fillAndBlur(getUsernameField(page), data['valid'].username);
		await expect(getUsernameError(page)).not.toBeVisible();

		// Currency
		await expect(getCurrencySelect(page)).toBeVisible();

		// Workspace name required
		await getWorkspaceNameField(page).click();
		await getWorkspaceNameField(page).blur();
		await expect(getWorkspaceNameError(page)).toHaveText('Field required');

		// Workspace name maxlength
		await getWorkspaceNameField(page).clear();
		await fillAndBlur(getWorkspaceNameField(page), data['incorrect'].workspaceNameMaxLengthCharacter.repeat(101));
		await expect(getWorkspaceNameError(page)).toHaveText('Max length is 100!');

		// Workspace name no errors
		await getWorkspaceNameField(page).clear();
		await fillAndBlur(getWorkspaceNameField(page), data['valid'].workspaceName);
		await expect(getWorkspaceNameError(page)).not.toBeVisible();

		// Email required
		await getEmailField(page).click();
		await getEmailField(page).blur();
		await expect(getEmailError(page)).toHaveText('Field required');

		// Email invalid format
		await getEmailField(page).clear();
		await fillAndBlur(getEmailField(page), data['incorrect'].email);
		await expect(getEmailError(page)).toHaveText('Invalid email format!');

		// Email valid format
		await getEmailField(page).clear();
		await fillAndBlur(getEmailField(page), `test_${getCurrentDate()}@gmail.com`);
		await expect(getEmailError(page)).not.toBeVisible();

		// Password required
		await getPasswordField(page).click();
		await getPasswordField(page).blur();
		await expect(getPwdError(page)).toHaveText('Field required');

		// Password invalid format
		await getPasswordField(page).clear();
		await fillAndBlur(getPasswordField(page), data['incorrect'].password);
		await expect(getPwdError(page)).toHaveText('Invalid password format!');

		// Password valid format
		await getPasswordField(page).clear();
		await fillAndBlur(getPasswordField(page), data['valid'].password);
		await expect(getPwdError(page)).not.toBeVisible();

		// Confirm password required
		await getConfirmPasswordField(page).click();
		await getConfirmPasswordField(page).blur();
		await expect(getConfirmPwdError(page)).toHaveText('Field required');

		// Password invalid
		await getConfirmPasswordField(page).clear();
		await fillAndBlur(getConfirmPasswordField(page), data['incorrect'].password);
		await expect(getConfirmPwdError(page)).toHaveText('Invalid password format!');

		// Confirm password valid
		await getConfirmPasswordField(page).clear();
		await fillAndBlur(getConfirmPasswordField(page), data['valid'].password);
		await expect(getConfirmPwdError(page)).not.toBeVisible();

		// Password mismatch
		await getConfirmPasswordField(page).clear();
		await fillAndBlur(getConfirmPasswordField(page), data['incorrect'].passwordMismatch);
		await expect(getConfirmPwdError(page)).toHaveText('Passwords should match!');

		await getConfirmPasswordField(page).clear();
		await fillAndBlur(getConfirmPasswordField(page), data['valid'].confirmPassword);
		await expect(getConfirmPwdError(page)).not.toBeVisible();
	});

	test('should clear username', async ({ page }) => {
		await expect(getUsernameClearBtn(page)).not.toBeVisible();
		await fillAndBlur(getUsernameField(page), data['valid'].username);
		await expect(getUsernameClearBtn(page)).toBeVisible();
		await getUsernameClearBtn(page).click();
		await expect(getUsernameField(page)).toHaveValue('');
	});

	test('should clear workspacename', async ({ page }) => {
		await expect(getWorkspaceNameClearBtn(page)).not.toBeVisible();
		await fillAndBlur(getWorkspaceNameField(page), data['valid'].workspaceName);
		await expect(getWorkspaceNameClearBtn(page)).toBeVisible();
		await getWorkspaceNameClearBtn(page).click();
		await expect(getWorkspaceNameField(page)).toHaveValue('');
	});

	test('should clear email', async ({ page }) => {
		await expect(getEmailClearBtn(page)).not.toBeVisible();
		await fillAndBlur(getEmailField(page), `test_${getCurrentDate()}@gmail.com`);
		await expect(getEmailClearBtn(page)).toBeVisible();
		await getEmailClearBtn(page).click();
		await expect(getEmailField(page)).toHaveValue('');
	});

	test('should clear password', async ({ page }) => {
		await expect(getPwdClearBtn(page)).not.toBeVisible();
		await fillAndBlur(getPasswordField(page), data['valid'].password);
		await expect(getPwdClearBtn(page)).toBeVisible();
		await getPwdClearBtn(page).click();
		await expect(getPasswordField(page)).toHaveValue('');
	});

	test('should clear confirm password', async ({ page }) => {
		await expect(getConfirmPwdClearBtn(page)).not.toBeVisible();
		await fillAndBlur(getConfirmPasswordField(page), data['valid'].confirmPassword);
		await expect(getConfirmPwdClearBtn(page)).toBeVisible();
		await getConfirmPwdClearBtn(page).click();
		await expect(getConfirmPasswordField(page)).toHaveValue('');
	});

	test('should toggle password visibility via password field button', async ({ page }) => {
		await expect(getShowPwdBtn(page)).not.toBeVisible();
		await fillAndBlur(getPasswordField(page), data['valid'].password);
		await fillAndBlur(getConfirmPasswordField(page), data['valid'].confirmPassword);
		await expect(getShowPwdBtn(page)).toBeVisible();

		await expect(getPasswordField(page)).toHaveAttribute('type', 'password');
		await expect(getConfirmPasswordField(page)).toHaveAttribute('type', 'password');

		await getShowPwdBtn(page).click();
		await expect(getPasswordField(page)).toHaveAttribute('type', 'text');
		await expect(getConfirmPasswordField(page)).toHaveAttribute('type', 'text');

		await getShowPwdBtn(page).click();
		await expect(getPasswordField(page)).toHaveAttribute('type', 'password');
		await expect(getConfirmPasswordField(page)).toHaveAttribute('type', 'password');
	});

	test('should toggle password visibility via confirm password field button', async ({ page }) => {
		await fillAndBlur(getPasswordField(page), data['valid'].password);
		await fillAndBlur(getConfirmPasswordField(page), data['valid'].confirmPassword);

		await expect(getPasswordField(page)).toHaveAttribute('type', 'password');
		await expect(getConfirmPasswordField(page)).toHaveAttribute('type', 'password');

		await getShowConfirmPwdBtn(page).click();
		await expect(getPasswordField(page)).toHaveAttribute('type', 'text');
		await expect(getConfirmPasswordField(page)).toHaveAttribute('type', 'text');

		await getShowConfirmPwdBtn(page).click();
		await expect(getPasswordField(page)).toHaveAttribute('type', 'password');
		await expect(getConfirmPasswordField(page)).toHaveAttribute('type', 'password');
	});

	test('should register successfully and redirect to login', async ({ page }) => {
		await fillAndBlur(getUsernameField(page), data['valid'].username);
		await fillAndBlur(getWorkspaceNameField(page), data['valid'].workspaceName);
		await fillAndBlur(getEmailField(page), `test_${getCurrentDate()}@gmail.com`);
		await fillAndBlur(getPasswordField(page), data['valid'].password);
		await fillAndBlur(getConfirmPasswordField(page), data['valid'].confirmPassword);
		await getRegisterBtn(page).click();
		await expect(getRegisterBtn(page)).not.toBeDisabled();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await page.waitForURL('/public/login');
	});

	test('should navigate to login', async ({ page }) => {
		await expect(getToLoginButton(page)).toBeVisible();
		await getToLoginButton(page).click();
		await page.waitForURL('/public/login');
	});
});
