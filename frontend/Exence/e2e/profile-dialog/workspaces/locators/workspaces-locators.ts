import { Locator, Page } from '@playwright/test';

// Your workspaces seciton
export const getWorkspacesTitle = (page: Page): Locator => page.getByTestId('workspace-list-title');
export const getWorkspaceRows = (page: Page): Locator => page.getByTestId('workspace-list-row');
export const getWorkspaceDetail = (locator: Locator): Locator => locator.getByTestId('workspace-detail');
export const getWorkspaceCurrentTag = (locator: Locator): Locator => locator.getByTestId('workspace-current-tag');
export const getWorkspaceAddMembers = (page: Page): Locator => page.getByTestId('workspace-add-member-btn');
export const getWorkspaceAddMember = (locator: Locator): Locator => locator.getByTestId('workspace-add-member-btn');
export const getWorkspaceEditBtns = (page: Page): Locator => page.getByTestId('workspace-edit-btn');
export const getWorkspaceEditBtn = (locator: Locator): Locator => locator.getByTestId('workspace-edit-btn');
export const getWorkspaceMembers = (page: Page): Locator => page.getByTestId('workspace-member');
export const getWorkspaceKickMember = (locator: Locator): Locator => locator.getByTestId('workspace-kick-btn');
export const getWorkspaceDeleteBtn = (locator: Locator): Locator => locator.getByTestId('workspace-delete-btn');
export const getWorkspaceLeaveBtns = (page: Page): Locator => page.getByTestId('workspace-leave-btn');
export const getWorkspaceLeaveBtn = (locator: Locator): Locator => locator.getByTestId('workspace-leave-btn');
export const getWorkspaceNames = (page: Page): Locator => page.getByTestId('workspace-name');

// Add workspace dialog
export const getAddWorkspaceDialog = (page: Page): Locator => page.getByTestId('add-workspace');
export const getWorkspaceAddBtn = (page: Page): Locator => page.getByTestId('workspace-add-btn');
export const getAddWorkspaceNameInput = (page: Page): Locator => page.getByTestId('add-workspace-name-input');
export const getAddWorkspaceNameInputClearBtn = (page: Page): Locator =>
	page.getByTestId('add-workspace-name-input-clear');
export const getAddWorkspaceCurrencyInput = (page: Page): Locator => page.getByTestId('add-workspace-currency-input');
export const getAddWorkspaceCurrencyOptions = (page: Page): Locator =>
	page.getByTestId('add-workspace-currency-options');
export const getAddWorkspaceCancelBtn = (page: Page): Locator => page.getByTestId('add-workspace-cancel-btn');
export const getAddWorkspaceCreateBtn = (page: Page): Locator => page.getByTestId('add-workspace-create-btn');
export const getAddWorkspaceCloseBtn = (page: Page): Locator =>
	page.getByTestId('add-workspace').getByTestId('close-btn');

// Add member dialog
export const getAddMemberDialog = (page: Page): Locator => page.getByTestId('add-member');
export const getAddMemberEmailInput = (page: Page): Locator => page.getByTestId('add-member-email-input');
export const getAddMemberEmailInputClearBtn = (page: Page): Locator =>
	page.getByTestId('add-member-email-input-clear-btn');
export const getAddMemberCancelBtn = (page: Page): Locator => page.getByTestId('add-member-cancel-btn');
export const getAddMemberAddBtn = (page: Page): Locator => page.getByTestId('add-member-add-btn');
export const getAddMemberCloseBtn = (page: Page): Locator => page.getByTestId('add-member').getByTestId('close-btn');

// Edit workspace dialog
export const getEditWorkspaceDialog = (page: Page): Locator => page.getByTestId('edit-workspace');
export const getEditWorkspaceNameInput = (page: Page): Locator => page.getByTestId('edit-workspace-name-input');
export const getEditWorkspaceNameInputClearBtn = (page: Page): Locator =>
	page.getByTestId('edit-workspace-name-input-clear-btn');
export const getEditWorkspaceCancelBtn = (page: Page): Locator => page.getByTestId('edit-workspace-cancel-btn');
export const getEditWorkspaceSaveBtn = (page: Page): Locator => page.getByTestId('edit-workspace-save-btn');
export const getEditWorkspaceCloseBtn = (page: Page): Locator =>
	page.getByTestId('edit-workspace').getByTestId('close-btn');

// Confirm exit dialog
export const getConfirmExitBtn = (page: Page, text: string): Locator =>
	page.getByTestId('action-btn').filter({ hasText: text });

// Currency settings
export const getCurrencySettingsTitle = (page: Page): Locator => page.getByTestId('currency-settings-title');
export const getCurrencySettingsBaseCurrencyInput = (page: Page): Locator =>
	page.getByTestId('currency-settings-base-currency-input');
export const getCurrencySettingsBaseCurrencyOptions = (page: Page): Locator =>
	page.getByTestId('currency-settings-base-currency-option');
export const getCurrencySettingsShowBaseCurrencyCheckbox = (page: Page): Locator =>
	page.getByTestId('show-base-currency-checkbox');
