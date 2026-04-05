import { Locator, Page } from '@playwright/test';

export const getToRegisterButton = (page: Page): Locator => page.getByTestId('toRegisterButton');

export const getLoginEmailField = (page: Page): Locator => page.getByTestId('emailField');

export const getEmailError = (page: Page): Locator => page.getByTestId('emailError');

export const getEmailClearBtn = (page: Page): Locator => page.getByTestId('emailClearBtn');

export const getLoginPasswordField = (page: Page): Locator => page.getByTestId('passwordField');

export const getPwdError = (page: Page): Locator => page.getByTestId('pwdError');

export const getShowPwdBtn = (page: Page): Locator => page.getByTestId('showPwdBtn');

export const getPwdClearBtn = (page: Page): Locator => page.getByTestId('pwdClearBtn');

export const getForgotPwdBtn = (page: Page): Locator => page.getByTestId('forgotPwdBtn');

export const getLoginBtn = (page: Page): Locator => page.getByTestId('loginBtn');
