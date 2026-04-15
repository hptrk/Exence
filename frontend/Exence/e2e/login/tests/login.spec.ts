import { expect, test } from '@playwright/test';
import { getErrorSnackbar, getSnackbarCloseBtn } from '../../snackbar/locators/snackbar-locators';
import data from '../data/login.data.json';
import {
	getEmailClearBtn,
	getEmailError,
	getForgotPwdBtn,
	getLoginBtn,
	getLoginEmailField,
	getLoginPasswordField,
	getPwdClearBtn,
	getPwdError,
	getShowPwdBtn,
	getToRegisterButton,
} from '../locators/login-locators';
import { fillAndBlur } from '../../form/utils/form-utils';

test.describe('Login', () => {
	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies({ domain: 'localhost' }); // TODO change based on env
		await page.addInitScript(() => localStorage.setItem('language', 'en'));
		await page.goto('/public/login', { waitUntil: 'domcontentloaded' });

		await expect(getErrorSnackbar(page)).toBeVisible();
		await getSnackbarCloseBtn(page).click();
	});

	test('should display validators', async ({ page }) => {
		// Email
		await getLoginEmailField(page).click();
		await getLoginEmailField(page).blur();
		await expect(getEmailError(page)).toHaveText('Field required');

		await getLoginEmailField(page).clear();
		await getLoginEmailField(page).click();
		await fillAndBlur(getLoginEmailField(page), data['incorrect'].email);
		await expect(getEmailError(page)).toHaveText('Invalid email format!');

		await getLoginEmailField(page).clear();
		await getLoginEmailField(page).click();
		await fillAndBlur(getLoginEmailField(page), data['correct'].email);
		await expect(getEmailError(page)).not.toBeVisible();

		// Password
		await getLoginPasswordField(page).click();
		await getLoginPasswordField(page).blur();
		await expect(getPwdError(page)).toHaveText('Field required');

		await getLoginPasswordField(page).clear();
		await getLoginPasswordField(page).click();
		await fillAndBlur(getLoginPasswordField(page), data['incorrect'].password);
		await expect(getPwdError(page)).toHaveText('Invalid password format!');

		await getLoginPasswordField(page).clear();
		await getLoginPasswordField(page).click();
		await fillAndBlur(getLoginPasswordField(page), data['correct'].password);
		await expect(getPwdError(page)).not.toBeVisible();
	});

	test('should clear email', async ({ page }) => {
		// Email clear
		await expect(getEmailClearBtn(page)).not.toBeVisible();
		await getLoginEmailField(page).clear();
		await getLoginEmailField(page).click();
		await fillAndBlur(getLoginEmailField(page), data['correct'].email);
		await expect(getEmailClearBtn(page)).toBeVisible();
		await getEmailClearBtn(page).click();
		await expect(getLoginEmailField(page)).not.toHaveValue(data['correct'].email);
	});
	test('should clear password', async ({ page }) => {
		// Password clear
		await expect(getPwdClearBtn(page)).not.toBeVisible();
		await getLoginPasswordField(page).clear();
		await getLoginPasswordField(page).click();
		await fillAndBlur(getLoginPasswordField(page), data['correct'].email);
		await expect(getPwdClearBtn(page)).toBeVisible();
		await getPwdClearBtn(page).click();
		await expect(getLoginPasswordField(page)).not.toHaveValue(data['correct'].email);
	});
	test('should toggle password', async ({ page }) => {
		// Password toggle
		await expect(getShowPwdBtn(page)).not.toBeVisible();
		await getLoginPasswordField(page).clear();
		await getLoginPasswordField(page).click();
		await fillAndBlur(getLoginPasswordField(page), data['correct'].password);
		await expect(getShowPwdBtn(page)).toBeVisible();
		await expect(getLoginPasswordField(page)).toHaveAttribute('type', 'password');
		await getShowPwdBtn(page).click();
		await expect(getLoginPasswordField(page)).toHaveAttribute('type', 'text');
		await getShowPwdBtn(page).click();
		await expect(getLoginPasswordField(page)).toHaveAttribute('type', 'password');
	});

	test('should login fail', async ({ page }) => {
		await fillAndBlur(getLoginEmailField(page), data['invalid'].email);
		await fillAndBlur(getLoginPasswordField(page), data['invalid'].password);
		await expect(getLoginBtn(page)).not.toBeDisabled();
		await getLoginBtn(page).click();
		await expect(getErrorSnackbar(page)).toBeVisible();
	});

	test('should successfully log in', async ({ page }) => {
		await fillAndBlur(getLoginEmailField(page), data['valid'].email);
		await fillAndBlur(getLoginPasswordField(page), data['valid'].password);
		await getLoginBtn(page).click();
		await page.waitForURL('/dashboard');
	});

	test('should navigate to register', async ({ page }) => {
		await expect(getToRegisterButton(page)).toBeVisible();
		await getToRegisterButton(page).click();
		await page.waitForURL('/public/register');
	});

	test('should navigate to forgot password', async ({ page }) => {
		await expect(getForgotPwdBtn(page)).toBeVisible();
		await getForgotPwdBtn(page).click();
		await page.waitForURL('/public/forgot-password');
	});
});
