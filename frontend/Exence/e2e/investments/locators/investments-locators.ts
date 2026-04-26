import { Locator, Page } from '@playwright/test';

// Empty state
export const getInvestmentsEmptyState = (page: Page): Locator => page.getByTestId('investments-empty-state');
export const getInvestmentsEmptyCreateBtn = (page: Page): Locator => page.getByTestId('investments-empty-create-btn');

// Statistics section
// The section uses flex-row — check scrollability via scrollWidth > clientWidth on this element
export const getInvestmentStatCards = (page: Page): Locator => page.getByTestId('investment-stat-cards');

// List section
// add-btn and data-row are provided by the shared data-table component
export const getInvestmentList = (page: Page): Locator => page.locator('ex-investment-list');
export const getInvestmentListAddBtn = (page: Page): Locator => page.getByTestId('add-btn');
export const getInvestmentListRows = (page: Page): Locator => page.getByTestId('data-row');
export const getInvestmentMenuTrigger = (row: Locator): Locator => row.getByTestId('menu-trigger-btn');
export const getInvestmentLastActionHeader = (page: Page): Locator =>
	page.locator('.table-header-row').filter({ hasText: 'Last Action' }).first();

// Row actions (from the shared data-table menu; testid = 'row-action-' + translated label lowercased)
export const getInvestmentEditAction = (page: Page): Locator => page.getByTestId('row-action-edit');
export const getInvestmentDeleteAction = (page: Page): Locator => page.getByTestId('row-action-delete');
// 'investments.addPurchase' translates to "Add purchase" → testid becomes 'row-action-add purchase'
export const getInvestmentAddPurchaseAction = (page: Page): Locator => page.getByTestId('row-action-add purchase');

// Expanded row details
export const getInvestmentExpandedDetails = (page: Page): Locator => page.getByTestId('investment-expanded-details');
export const getInvestmentExpandedDetailAmount = (page: Page): Locator => page.getByTestId('investment-detail-amount');
export const getInvestmentExpandedDetailDate = (page: Page): Locator => page.getByTestId('investment-detail-date');
export const getInvestmentExpandedDetailType = (page: Page): Locator => page.getByTestId('investment-detail-type');
export const getInvestmentExpandedDetailNote = (page: Page): Locator => page.getByTestId('investment-detail-note');

// Purchase rows within expanded detail (use .nth(index) to target a specific row)
export const getInvestmentPurchaseAmounts = (page: Page): Locator => page.getByTestId('investment-purchase-amount');
export const getInvestmentPurchaseEditBtns = (page: Page): Locator => page.getByTestId('investment-purchase-edit-btn');
export const getInvestmentPurchaseDeleteBtns = (page: Page): Locator =>
	page.getByTestId('investment-purchase-delete-btn');
