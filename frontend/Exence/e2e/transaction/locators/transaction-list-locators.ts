import { Locator, Page } from '@playwright/test';

export const getListAddBtn = (list: Locator): Locator => list.getByTestId('add-btn');
export const getListDataRow = (list: Locator, title: string): Locator =>
	list.getByTestId('data-row').filter({ hasText: title });
export const getListEmptyState = (list: Locator): Locator => list.getByTestId('empty-state');
export const getListDataRowMenuTriggerBtn = (row: Locator): Locator => row.getByTestId('menu-trigger-btn');

export const getRowActionDelete = (page: Page): Locator => page.getByTestId('row-action-delete');
export const getRowActionDuplicate = (page: Page): Locator => page.getByTestId('row-action-duplicate');
export const getRowActionEdit = (page: Page): Locator => page.getByTestId('row-action-edit');
