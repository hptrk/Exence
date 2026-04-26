import { Page } from '@playwright/test';
import { LoginRequest } from '../../src/app/data-model/modules/auth/LoginRequest';
import { RegisterRequest } from '../../src/app/data-model/modules/auth/RegisterRequest';
import { getLoginBtn, getLoginEmailField, getLoginPasswordField } from '../login/locators/login-locators';
import {
	getConfirmPasswordField,
	getEmailField,
	getPasswordField,
	getRegisterBtn,
	getUsernameField,
	getWorkspaceNameField,
} from '../register/locators/register-locators';
import { getErrorSnackbar, getSnackbarCloseBtn } from '../snackbar/locators/snackbar-locators';
import dataJson from './data/auth.data.json';
import { fillAndBlur, getCurrentDate } from '../form/utils/form-utils';

interface Credentials {
	username: string;
	workspaceName: string;
	email: string;
}

interface LoginCredentials {
	admin: LoginRequest;
	user: LoginRequest;
}

interface AuthData {
	login: LoginCredentials;
	register: RegisterRequest;
}

interface AuthInfo {
	admin: AuthData;
	user: AuthData;
}

export async function attemptLogin(page: Page, type: 'user' | 'admin'): Promise<void> {
	const data: AuthInfo = JSON.parse(JSON.stringify(dataJson));
	const credentials = data[type].login;

	await page.goto('/public/login');

	await fillAndBlur(getLoginEmailField(page), credentials.email);
	await fillAndBlur(getLoginPasswordField(page), credentials.password);
	await getLoginBtn(page).click();
	await page.waitForURL('/dashboard');
}

export async function attemptLoginWithEmail(page: Page, email: string): Promise<void> {
	const data: AuthInfo = JSON.parse(JSON.stringify(dataJson));
	const password = data.user.register.password;

	if (!page.url().includes('/public/login')) {
		await page.goto('/public/login');
	}

	await fillAndBlur(getLoginEmailField(page), email);
	await fillAndBlur(getLoginPasswordField(page), password);
	await getLoginBtn(page).click();
	await page.waitForURL('/dashboard');
}

export async function registerAndLogin(page: Page, credentials?: Credentials): Promise<void> {
	const data: AuthInfo = JSON.parse(JSON.stringify(dataJson));
	const timestamp = getCurrentDate();
	const email = `e2e_${timestamp}@test.com`;
	const password = data.user.register.password;

	await page.goto('/public/register');

	const snackbar = getErrorSnackbar(page);
	if (await snackbar.isVisible()) {
		await getSnackbarCloseBtn(page).click();
	}

	await fillAndBlur(getUsernameField(page), credentials?.username ?? 'E2E Test User');
	await fillAndBlur(getWorkspaceNameField(page), credentials?.workspaceName ?? 'E2E Workspace');
	await fillAndBlur(getEmailField(page), credentials?.email ?? email);
	await fillAndBlur(getPasswordField(page), password);
	await fillAndBlur(getConfirmPasswordField(page), password);
	await getRegisterBtn(page).click();
	await page.waitForURL('/public/login');

	await attemptLoginWithEmail(page, credentials?.email ?? email);
}
