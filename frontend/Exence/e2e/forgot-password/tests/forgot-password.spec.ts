import { expect, test } from '@playwright/test';
import { fillAndBlur } from '../../form/utils/form-utils';
import { getErrorSnackbar, getSnackbarCloseBtn, getSuccessSnackbar } from '../../snackbar/locators/snackbar-locators';
import data from '../data/forgot-password.data.json';
import {
	getChangeEmailBtn,
	getEmailClearBtn,
	getEmailError,
	getEmailField,
	getEmailSentTitle,
	getForgotPasswordTitle,
	getResendEmailBtn,
	getSendEmailBtn,
	getToLoginButton,
} from '../locators/forgot-password-locators';

test.describe('Forgot Password', () => {
	// Initialization: register a test account (idempotent - succeeds even if already registered)
	test.beforeEach(async ({ page, context }) => {
		await context.clearCookies({ domain: 'localhost' });
		await page.addInitScript(() => localStorage.setItem('language', 'en'));
		await page.goto('/public/forgot-password', { waitUntil: 'domcontentloaded' });
	});

	test('should display correct title, form fields', async ({ page }) => {
		await expect(getForgotPasswordTitle(page)).toBeVisible();
		await expect(getEmailField(page)).toBeVisible();
		await expect(getSendEmailBtn(page)).toBeVisible();
	});

	test('should display valiators', async ({ page }) => {
		await getEmailField(page).click();
		await getEmailField(page).blur();
		await expect(getEmailError(page)).toHaveText('Field required');

		await fillAndBlur(getEmailField(page), data['incorrect'].email);
		await expect(getEmailError(page)).toHaveText('Invalid email format!');
	});

	test('should clear Email field when clear button is clicked', async ({ page }) => {
		await expect(getEmailClearBtn(page)).not.toBeVisible();
		await fillAndBlur(getEmailField(page), data['valid'].email);
		await expect(getEmailClearBtn(page)).toBeVisible();
		await getEmailClearBtn(page).click();
		await expect(getEmailField(page)).toHaveValue('');
	});

	test('should handle full forgot password flow', async ({ page }) => {
		// Send email to existing user
		await fillAndBlur(getEmailField(page), data['valid'].email);
		await expect(getSendEmailBtn(page)).not.toBeDisabled();
		await getSendEmailBtn(page).click();

		// Check snackbar first (transient) then persistent UI
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getEmailSentTitle(page)).toBeVisible();
		await expect(getResendEmailBtn(page)).toBeVisible();
		await expect(getChangeEmailBtn(page)).toBeVisible();
		await getSnackbarCloseBtn(page).click();

		// Resend email
		await getResendEmailBtn(page).click();
		await expect(getEmailSentTitle(page)).toBeVisible();

		// Change email address - should go back to main forgot password form
		await getChangeEmailBtn(page).click();

		await expect(getForgotPasswordTitle(page)).toBeVisible();
		await expect(getEmailField(page)).toHaveValue(data['valid'].email);
		await expect(getSendEmailBtn(page)).not.toBeDisabled();

		// Try sending same email again - should fail with rate limit
		await getSendEmailBtn(page).click();
		await expect(getErrorSnackbar(page)).toBeVisible();

		// Change to a different email that works
		await getEmailField(page).clear();
		await fillAndBlur(getEmailField(page), data['valid'].successfulResendEmail);
		await getSendEmailBtn(page).click();

		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getEmailSentTitle(page)).toBeVisible();
		await expect(getResendEmailBtn(page)).toBeVisible();
		await expect(getChangeEmailBtn(page)).toBeVisible();
	});

	test('should navigate from login to forgot password and back', async ({ page }) => {
		await getToLoginButton(page).click();
		await page.waitForURL('/public/login');
	});
});
