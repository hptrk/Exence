import { Locator, Page } from '@playwright/test';

// Profile data
export const getProfileDataTitle = (page: Page): Locator => page.getByTestId('profile-information-profile-data-title');
export const getEditProfileDataCancelBtn = (page: Page): Locator => page.getByTestId('profile-data-edit-cancel-btn');
export const getEditProfileDataSaveBtn = (page: Page): Locator => page.getByTestId('profile-data-edit-save-btn');
export const getEditProfileDataSaveBtnInner = (page: Page): Locator =>
	page.getByTestId('profile-data-edit-save-btn').getByTestId('btn');
export const getProfileDataEditBtn = (page: Page): Locator => page.getByTestId('profile-data-edit-btn');
export const getProfileDataUsernameInput = (page: Page): Locator =>
	page.getByTestId('profile-information-profile-data-username-input');
export const getProfileDataUsernameClearBtn = (page: Page): Locator =>
	page.getByTestId('profile-information-profile-data-username-input-clear');
export const getProfileDataEmailInput = (page: Page): Locator => page.getByTestId('profile-data-email-input');

// Change password
export const getChangePwdTitle = (page: Page): Locator => page.getByTestId('profile-information-change-password-title');
export const getChangePwdCancelBtn = (page: Page): Locator => page.getByTestId('profile-information-edit-cancel-btn');
export const getChangePwdSaveBtn = (page: Page): Locator => page.getByTestId('profile-information-edit-save-btn');
export const getChangePwdSaveBtnInner = (page: Page): Locator =>
	page.getByTestId('profile-information-edit-save-btn').getByTestId('btn');
export const getChangePwdBtn = (page: Page): Locator => page.getByTestId('profile-information-edit-btn');
export const getChangePwdOldPwdInput = (page: Page): Locator => page.getByTestId('profile-information-old-pwd-input');
export const getChangePwdOldPwdShowBtn = (page: Page): Locator => page.getByTestId('profile-information-old-pwd-show');
export const getChangePwdOldPwdClearBtn = (page: Page): Locator =>
	page.getByTestId('profile-information-old-pwd-input-clear');
export const getChangePwdNewPwdInput = (page: Page): Locator => page.getByTestId('profile-information-new-pwd-input');
export const getChangePwdNewPwdInputShowBtn = (page: Page): Locator =>
	page.getByTestId('profile-information-new-pwd-show');
export const getChangePwdNewPwdClearBtn = (page: Page): Locator =>
	page.getByTestId('profile-information-new-pwd-input-clear');
export const getChangePwdConfirmPwdInput = (page: Page): Locator =>
	page.getByTestId('profile-information-confirm-pwd-input');
export const getChangePwdConfirmPwdShow = (page: Page): Locator =>
	page.getByTestId('profile-information-confirm-pwd-show');
export const getChangePwdConfirmPwdClearBtn = (page: Page): Locator =>
	page.getByTestId('profile-information-confirm-pwd-input-clear');
