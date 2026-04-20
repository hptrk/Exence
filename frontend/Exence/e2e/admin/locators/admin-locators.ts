import { Locator, Page } from '@playwright/test';

// Tab group
export const getAdminTabGroup = (page: Page): Locator => page.locator('mat-tab-group');

export const getAdminTabByIndex = (page: Page, index: number): Locator => page.locator('[role="tab"]').nth(index);

export const getAdminTabIcon = (tab: Locator): Locator => tab.locator('mat-icon');

// Statistics section
export const getStatisticsSection = (page: Page): Locator => page.locator('ex-admin-statistics-list');
export const getAdminCharts = (page: Page): Locator => page.locator('ex-admin-chart');
export const getChartWidgets = (page: Page): Locator => page.locator('ex-chart-widget');

export const getCardGrid = (page: Page): Locator => page.locator('.card-grid');

export const getChartGrid = (page: Page): Locator => page.locator('.chart-grid');

export const getChartWidgetByTitle = (page: Page, title: string): Locator =>
	page.locator('ex-chart-widget').filter({ hasText: title });

export const getStatCards = (page: Page): Locator => page.locator('ex-stat-card');

export const getLeaderboards = (page: Page): Locator => page.locator('ex-leaderboard');

export const getLeaderboardByTitle = (page: Page, title: string): Locator =>
	page.locator('ex-leaderboard').filter({ hasText: title });

// Logs section
export const getAuditLogSection = (page: Page): Locator => page.locator('ex-admin-audit-log');

export const getAuditLogList = (page: Page): Locator => page.locator('ex-audit-log-list');

export const getAuditDataRows = (page: Page): Locator => page.locator('ex-audit-log-list').getByTestId('data-row');

export const getAuditRowByAction = (page: Page, actionLabel: string): Locator =>
	page.locator('ex-audit-log-list').getByTestId('data-row').filter({ hasText: actionLabel }).first();

export const getExpandedDetails = (page: Page): Locator => page.locator('.audit-details').first();

export const getDateColumnHeader = (page: Page): Locator =>
	page.locator('ex-audit-log-list th').filter({ hasText: 'Date' });

export const getAuditChangeTypeFormField = (page: Page): Locator =>
	page.locator('mat-form-field').filter({ hasText: 'Change Type' });

export const getAuditChangeTypeSelect = (page: Page): Locator =>
	getAuditChangeTypeFormField(page).locator('mat-select');

export const getAuditFilterOption = (page: Page, label: string): Locator => page.getByRole('option', { name: label });

export const getPageTransactionList = (page: Page): Locator => page.getByTestId('transaction-list');

export const getTransactionListFirstRow = (page: Page): Locator =>
	page.getByTestId('transaction-list').getByTestId('data-row').first();

export const getTransactionRowMenuTrigger = (row: Locator): Locator => row.getByTestId('menu-trigger-btn');

export const getUpdatedTransactionAuditRow = (page: Page, actionLabel: string, entityLabel: string): Locator =>
	page
		.locator('ex-audit-log-list')
		.getByTestId('data-row')
		.filter({ hasText: actionLabel })
		.filter({ hasText: entityLabel })
		.first();

// System Settings section
export const getSystemSettingsSection = (page: Page): Locator => page.locator('ex-system-settings');

export const getToggleCards = (page: Page): Locator => page.locator('ex-toggle-card');

export const getToggleCardByLabel = (page: Page, labelText: string): Locator =>
	page.locator('ex-toggle-card').filter({ hasText: labelText });

export const getSlideToggleInCard = (card: Locator): Locator => card.locator('mat-slide-toggle');

export const getSlideToggleSwitch = (card: Locator): Locator => card.getByRole('switch');

export const getInfoBtnInCard = (card: Locator): Locator => card.locator('ex-info-button');

export const getAmountStepperByLabel = (page: Page, labelText: string): Locator =>
	page.locator('ex-amount-stepper').filter({ hasText: labelText });

export const getAmountStepperInput = (stepper: Locator): Locator => stepper.locator('input[type="number"]');

export const getAmountStepperError = (stepper: Locator): Locator => stepper.locator('mat-error');

export const getChipSet = (page: Page): Locator => page.locator('ex-system-settings').locator('mat-chip-set');

export const getPathChips = (page: Page): Locator =>
	page.locator('ex-system-settings').locator('mat-chip-set mat-chip');

export const getPathChipByText = (page: Page, text: string): Locator => getPathChips(page).filter({ hasText: text });

export const getAddPathChipBtn = (page: Page): Locator =>
	page.locator('ex-system-settings').locator('mat-chip-set mat-chip').filter({ hasText: 'Add' });

export const getRemoveBtnOnChip = (chip: Locator): Locator => chip.locator('button[matChipRemove]');

export const getAddPathDialog = (page: Page): Locator => page.locator('mat-dialog-container');

export const getAddPathInput = (page: Page): Locator => page.locator('mat-dialog-container').locator('input');

export const getDialogAddBtn = (page: Page): Locator =>
	page.locator('mat-dialog-container').getByRole('button', { name: 'Add' });

export const getDialogCancelBtn = (page: Page): Locator =>
	page.locator('mat-dialog-container').getByRole('button', { name: 'Cancel' });

export const getTooltipSurface = (page: Page): Locator => page.locator('.mat-mdc-tooltip-surface');

export const getFirstRemovableChip = (page: Page): Locator =>
	getPathChips(page)
		.filter({ hasNot: page.locator('mat-icon', { hasText: 'add' }) })
		.first();

export const getSectionHeading = (page: Page, text: string): Locator => page.getByText(text, { exact: true });

export const getCancelSystemSettingsBtn = (page: Page): Locator =>
	page.locator('ex-system-settings').getByRole('button', { name: 'Cancel' });

export const getSaveSystemSettingsBtn = (page: Page): Locator =>
	page.locator('ex-system-settings').getByRole('button', { name: 'Save' });

// Admin Registration section
export const getRegistrationSection = (page: Page): Locator => page.locator('ex-admin-registration');

export const getRegUsernameInput = (page: Page): Locator =>
	page.locator('ex-admin-registration').getByLabel('Username');

export const getRegWorkspaceInput = (page: Page): Locator =>
	page.locator('ex-admin-registration').getByLabel('Workspace name');

export const getRegEmailInput = (page: Page): Locator => page.locator('ex-admin-registration').getByLabel('Email');

export const getRegPasswordInput = (page: Page): Locator =>
	page
		.locator('ex-admin-registration')
		.locator('mat-form-field')
		.filter({ hasText: 'Password' })
		.first()
		.locator('input');

export const getRegConfirmInput = (page: Page): Locator =>
	page
		.locator('ex-admin-registration')
		.locator('mat-form-field')
		.filter({ hasText: 'Confirm password' })
		.locator('input');

export const getRegFormFieldClearBtn = (page: Page, labelText: string): Locator =>
	page
		.locator('ex-admin-registration')
		.locator('mat-form-field')
		.filter({ hasText: labelText })
		.locator('ex-input-clear button');

export const getShowPasswordBtn = (page: Page): Locator =>
	page.locator('ex-admin-registration').locator('ex-show-password').first().locator('button');

export const getCreateAccountBtn = (page: Page): Locator =>
	page.locator('ex-admin-registration').getByRole('button', { name: 'Create Account' });

export const getRegFieldError = (page: Page, labelText: string): Locator =>
	page.locator('ex-admin-registration').locator('mat-form-field').filter({ hasText: labelText }).locator('mat-error');

export const getRegPasswordError = (page: Page): Locator =>
	page
		.locator('ex-admin-registration')
		.locator('mat-form-field')
		.filter({ hasText: 'Password' })
		.first()
		.locator('mat-error');

export const getRegConfirmPasswordError = (page: Page): Locator =>
	page
		.locator('ex-admin-registration')
		.locator('mat-form-field')
		.filter({ hasText: 'Confirm password' })
		.locator('mat-error');

export const getRegPasswordClearBtn = (page: Page): Locator =>
	page
		.locator('ex-admin-registration')
		.locator('mat-form-field')
		.filter({ hasText: 'Password' })
		.first()
		.locator('ex-input-clear button');

export const getRegConfirmClearBtn = (page: Page): Locator =>
	page
		.locator('ex-admin-registration')
		.locator('mat-form-field')
		.filter({ hasText: 'Confirm password' })
		.locator('ex-input-clear button');

// Email Broadcast section
export const getEmailBroadcastSection = (page: Page): Locator => page.locator('ex-email-broadcast');

export const getSubjectInput = (page: Page): Locator => page.locator('ex-email-broadcast').getByLabel('Email subject');

export const getSubjectClearBtn = (page: Page): Locator =>
	page.locator('ex-email-broadcast').locator('ex-input-clear button');

export const getBroadcastContentInput = (page: Page): Locator =>
	page.locator('ex-email-broadcast').locator('ex-markdown-editor textarea').last();

export const getClearBroadcastBtn = (page: Page): Locator =>
	page.locator('ex-email-broadcast').getByRole('button', { name: 'Clear' });

export const getSendBtn = (page: Page): Locator =>
	page.locator('ex-email-broadcast').getByRole('button', { name: 'Send' });

export const getBroadcastSubjectError = (page: Page): Locator =>
	page.locator('ex-email-broadcast').locator('mat-error');

export const getConfirmDialog = (page: Page): Locator => page.locator('mat-dialog-container');

export const getBroadcastFormTextarea = (page: Page): Locator =>
	page.locator('ex-email-broadcast').locator('ex-markdown-editor textarea').first();

export const getBroadcastConfirmSendBtn = (page: Page): Locator =>
	page.locator('.cdk-overlay-container').getByRole('button', { name: /^send$/i });
