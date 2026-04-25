import { Locator, Page } from '@playwright/test';

// Tab group
export const getAdminTabGroup = (page: Page): Locator => page.getByTestId('admin-tab-group');

export const getAdminTabByIndex = (page: Page, index: number): Locator =>
	getAdminTabGroup(page).getByRole('tab').nth(index);

export const getAdminTabIcon = (tab: Locator): Locator => tab.locator('mat-icon');

// Statistics section
export const getStatisticsSection = (page: Page): Locator => page.getByTestId('admin-statistics-section');
export const getAdminCharts = (page: Page): Locator => page.getByTestId('admin-chart');
export const getChartWidgets = (page: Page): Locator => page.getByTestId('chart-widget');

export const getCardGrid = (page: Page): Locator => page.getByTestId('admin-card-grid');

export const getChartGrid = (page: Page): Locator => page.getByTestId('admin-chart-grid');

export const getChartWidgetByTitle = (page: Page, title: string): Locator =>
	page.getByTestId('chart-widget').filter({ hasText: title });

export const getStatCards = (page: Page): Locator => page.getByTestId('stat-card');

export const getLeaderboards = (page: Page): Locator => page.getByTestId('leaderboard');

export const getLeaderboardByTitle = (page: Page, title: string): Locator =>
	page.getByTestId('leaderboard').filter({ hasText: title });

// Logs section
export const getAuditLogSection = (page: Page): Locator => page.getByTestId('admin-audit-log-section');

export const getAuditLogList = (page: Page): Locator => page.getByTestId('audit-log-list');

export const getAuditDataRows = (page: Page): Locator => page.getByTestId('audit-log-list').getByTestId('data-row');

export const getAuditRowByAction = (page: Page, actionLabel: string): Locator =>
	page.getByTestId('audit-log-list').getByTestId('data-row').filter({ hasText: actionLabel }).first();

export const getExpandedDetails = (page: Page): Locator => page.getByTestId('audit-details').first();

export const getDateColumnHeader = (page: Page): Locator =>
	page.getByTestId('audit-log-list').locator('th').filter({ hasText: 'Date' });

export const getAuditChangeTypeSelect = (page: Page): Locator =>
	page.getByTestId('admin-change-type-select').locator('.mat-mdc-select-arrow-wrapper');

export const getAuditFilterOption = (page: Page, label: string): Locator => page.getByRole('option', { name: label });

export const getPageTransactionList = (page: Page): Locator => page.getByTestId('transaction-list');

export const getTransactionListFirstRow = (page: Page): Locator =>
	page.getByTestId('transaction-list').getByTestId('data-row').first();

export const getTransactionRowMenuTrigger = (row: Locator): Locator => row.getByTestId('menu-trigger-btn');

export const getUpdatedTransactionAuditRow = (page: Page, actionLabel: string, entityLabel: string): Locator =>
	page
		.getByTestId('audit-log-list')
		.getByTestId('data-row')
		.filter({ hasText: actionLabel })
		.filter({ hasText: entityLabel })
		.first();

// System Settings section
export const getSystemSettingsSection = (page: Page): Locator => page.getByTestId('admin-system-settings-section');

export const getToggleCards = (page: Page): Locator => page.getByTestId('toggle-card');

export const getToggleCardByLabel = (page: Page, labelText: string): Locator =>
	page.getByTestId('toggle-card').filter({ hasText: labelText });

export const getSlideToggleInCard = (card: Locator): Locator => card.locator('mat-slide-toggle');

export const getSlideToggleSwitch = (card: Locator): Locator => card.getByRole('switch');

export const getInfoBtnInCard = (card: Locator): Locator => card.locator('ex-info-button');

export const getAmountStepperByLabel = (page: Page, labelText: string): Locator =>
	page.getByTestId('amount-stepper').filter({ hasText: labelText });

export const getAmountStepperInput = (stepper: Locator): Locator => stepper.locator('input[type="number"]');

export const getAmountStepperError = (stepper: Locator): Locator => stepper.locator('mat-error');

export const getChipSet = (page: Page): Locator => page.getByTestId('path-chip-set');

export const getPathChips = (page: Page): Locator => page.getByTestId('path-chip');

export const getPathChipByText = (page: Page, text: string): Locator =>
	page.getByTestId('path-chip').filter({ hasText: text });

export const getAddPathChipBtn = (page: Page): Locator => page.getByTestId('add-path-chip');

export const getRemoveBtnOnChip = (chip: Locator): Locator => chip.locator('button[matChipRemove]');

export const getAddPathDialog = (page: Page): Locator => page.locator('mat-dialog-container');

export const getAddPathInput = (page: Page): Locator => page.getByTestId('add-path-input');

export const getDialogAddBtn = (page: Page): Locator =>
	page.locator('mat-dialog-container').getByRole('button', { name: 'Add' });

export const getDialogCancelBtn = (page: Page): Locator =>
	page.locator('mat-dialog-container').getByRole('button', { name: 'Cancel' });

export const getTooltipSurface = (page: Page): Locator => page.locator('.mat-mdc-tooltip-surface');

export const getFirstRemovableChip = (page: Page): Locator => page.getByTestId('path-chip').first();

export const getSectionHeading = (page: Page, text: string): Locator => page.getByText(text, { exact: true });

export const getCancelSystemSettingsBtn = (page: Page): Locator =>
	page.getByTestId('admin-system-settings-section').getByRole('button', { name: 'Cancel' });

export const getSaveSystemSettingsBtn = (page: Page): Locator =>
	page.getByTestId('admin-system-settings-section').getByRole('button', { name: 'Save' });

// Admin Registration section
export const getRegistrationSection = (page: Page): Locator => page.getByTestId('admin-registration-section');

export const getRegUsernameInput = (page: Page): Locator =>
	page.getByTestId('admin-registration-section').getByLabel('Username');

export const getRegWorkspaceInput = (page: Page): Locator =>
	page.getByTestId('admin-registration-section').getByLabel('Workspace name');

export const getRegEmailInput = (page: Page): Locator =>
	page.getByTestId('admin-registration-section').getByLabel('Email');

export const getRegPasswordInput = (page: Page): Locator => page.getByTestId('reg-password-input');

export const getRegConfirmInput = (page: Page): Locator => page.getByTestId('reg-confirm-password-input');

export const getRegFormFieldClearBtn = (page: Page, labelText: string): Locator =>
	page
		.getByTestId('admin-registration-section')
		.locator('mat-form-field')
		.filter({ hasText: labelText })
		.locator('ex-input-clear button');

export const getShowPasswordBtn = (page: Page): Locator =>
	page.getByTestId('admin-registration-section').getByTestId('toggle-password-btn').first();

export const getCreateAccountBtn = (page: Page): Locator =>
	page.getByTestId('admin-registration-section').getByRole('button', { name: 'Create Account' });

export const getRegFieldError = (page: Page, labelText: string): Locator =>
	page
		.getByTestId('admin-registration-section')
		.locator('mat-form-field')
		.filter({ hasText: labelText })
		.locator('mat-error');

export const getRegPasswordError = (page: Page): Locator => page.getByTestId('reg-password-field').locator('mat-error');

export const getRegConfirmPasswordError = (page: Page): Locator =>
	page.getByTestId('reg-confirm-password-field').locator('mat-error');

export const getRegPasswordClearBtn = (page: Page): Locator =>
	page.getByTestId('reg-password-field').locator('ex-input-clear button');

export const getRegConfirmClearBtn = (page: Page): Locator =>
	page.getByTestId('reg-confirm-password-field').locator('ex-input-clear button');

// Email Broadcast section
export const getEmailBroadcastSection = (page: Page): Locator => page.getByTestId('admin-email-broadcast-section');

export const getSubjectInput = (page: Page): Locator =>
	page.getByTestId('admin-email-broadcast-section').getByLabel('Email subject');

export const getSubjectClearBtn = (page: Page): Locator =>
	page.getByTestId('admin-email-broadcast-section').locator('ex-input-clear button');

export const getBroadcastContentInput = (page: Page): Locator =>
	page.getByTestId('admin-email-broadcast-section').locator('ex-markdown-editor textarea').last();

export const getClearBroadcastBtn = (page: Page): Locator =>
	page.getByTestId('admin-email-broadcast-section').getByRole('button', { name: 'Clear' });

export const getSendBtn = (page: Page): Locator =>
	page.getByTestId('admin-email-broadcast-section').getByRole('button', { name: 'Send' });

export const getBroadcastSubjectError = (page: Page): Locator =>
	page.getByTestId('admin-email-broadcast-section').locator('mat-error');

export const getConfirmDialog = (page: Page): Locator => page.locator('mat-dialog-container');

export const getBroadcastFormTextarea = (page: Page): Locator =>
	page.getByTestId('admin-email-broadcast-section').locator('ex-markdown-editor textarea').first();

export const getBroadcastConfirmSendBtn = (page: Page): Locator =>
	page.locator('.cdk-overlay-container').getByRole('button', { name: /^send$/i });
