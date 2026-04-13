import { Locator, Page } from '@playwright/test';

export const getToLoginButton = (page: Page): Locator => page.getByTestId('toLoginButton');

export const getUsernameField = (page: Page): Locator => page.getByTestId('usernameField');

export const getUsernameError = (page: Page): Locator => page.getByTestId('usernameError');

export const getUsernameClearBtn = (page: Page): Locator => page.getByTestId('usernameClearBtn');

export const getCurrencySelect = (page: Page): Locator => page.getByTestId('currencySelect');

export const getEmailField = (page: Page): Locator => page.getByTestId('emailField');

export const getEmailError = (page: Page): Locator => page.getByTestId('emailError');

export const getEmailClearBtn = (page: Page): Locator => page.getByTestId('emailClearBtn');

export const getPasswordField = (page: Page): Locator => page.getByTestId('passwordField');

export const getPwdError = (page: Page): Locator => page.getByTestId('pwdError');

export const getShowPwdBtn = (page: Page): Locator => page.getByTestId('showPwdBtn');

export const getPwdClearBtn = (page: Page): Locator => page.getByTestId('pwdClearBtn');

export const getConfirmPasswordField = (page: Page): Locator => page.getByTestId('confirmPasswordField');

export const getConfirmPwdError = (page: Page): Locator => page.getByTestId('confirmPwdError');

export const getShowConfirmPwdBtn = (page: Page): Locator => page.getByTestId('showConfirmPwdBtn');

export const getConfirmPwdClearBtn = (page: Page): Locator => page.getByTestId('confirmPwdClearBtn');

export const getRegisterBtn = (page: Page): Locator => page.getByTestId('registerBtn');
