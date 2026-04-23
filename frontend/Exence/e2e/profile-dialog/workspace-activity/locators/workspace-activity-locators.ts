import { Locator, Page } from '@playwright/test';

export const getWorkspaceActivityFilterBtn = (page: Page): Locator => page.getByTestId('filter-menu-btn');
export const getWorkspaceActivityFilterBtnInner = (page: Page): Locator =>
	getWorkspaceActivityFilterBtn(page).getByTestId('btn');
export const getWorkspaceActivityFilterBadge = (page: Page): Locator =>
	getWorkspaceActivityFilterBtn(page).locator('.mat-badge-content');

export const getAuditLogList = (page: Page): Locator => page.locator('ex-audit-log-list');
export const getAuditLogRows = (page: Page): Locator => page.locator('ex-audit-log-list').getByTestId('data-row');
export const getAuditLogRowByAction = (page: Page, actionLabel: string): Locator =>
	page.locator('ex-audit-log-list').getByTestId('data-row').filter({ hasText: actionLabel }).first();
export const getAuditLogEmptyState = (page: Page): Locator =>
	page.locator('ex-audit-log-list').getByTestId('empty-state');

export const getAuditLogExpandedDetails = (page: Page): Locator => page.locator('.audit-details').first();

export const getDateColumnHeader = (page: Page): Locator =>
	page.locator('ex-audit-log-list th').filter({ hasText: 'Date' });

export const getChangeTypeSelect = (page: Page): Locator => page.getByTestId('audit-log-change-type-select');
export const getAuditFilterOption = (page: Page, label: string): Locator =>
	page.getByRole('option', { name: label });
