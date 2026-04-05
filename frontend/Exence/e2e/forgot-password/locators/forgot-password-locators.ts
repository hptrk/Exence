import { Locator, Page } from '@playwright/test';

export const getForgotPasswordTitle = (page: Page): Locator => page.getByTestId('forgotPasswordTitle');

export const getEmailField = (page: Page): Locator => page.getByTestId('emailField');

export const getEmailError = (page: Page): Locator => page.getByTestId('emailError');

export const getEmailClearBtn = (page: Page): Locator => page.getByTestId('emailClearBtn');

export const getSendEmailBtn = (page: Page): Locator => page.getByTestId('sendEmailBtn');

export const getToLoginButton = (page: Page): Locator => page.getByTestId('toLoginButton');

export const getEmailSentTitle = (page: Page): Locator => page.getByTestId('emailSentTitle');

export const getResendEmailBtn = (page: Page): Locator => page.getByTestId('resendEmailBtn');

export const getChangeEmailBtn = (page: Page): Locator => page.getByTestId('changeEmailBtn');
