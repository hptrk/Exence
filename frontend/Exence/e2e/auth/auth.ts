import { Page } from '@playwright/test';
import { LoginRequest } from '../../src/app/data-model/modules/auth/LoginRequest';
import { RegisterRequest } from '../../src/app/data-model/modules/auth/RegisterRequest';
import { getLoginBtn, getLoginEmailField, getLoginPasswordField } from '../login/locators/login-locators';
import dataJson from './data/auth.data.json';
import { fillAndBlur } from '../form/utils/form-utils';

interface AuthInfo {
	admin: AuthData;
	user: AuthData;
}

interface AuthData {
	login: LoginRequest;
	register: RegisterRequest;
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
