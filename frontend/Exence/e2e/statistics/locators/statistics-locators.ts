import { Locator, Page } from '@playwright/test';

// Main action buttons
export const getMoreBtn = (page: Page): Locator => page.getByTestId('statistics-more-btn');
export const getEditMenuItem = (page: Page): Locator => page.getByTestId('statistics-edit-menu-item');
export const getAddMenuItem = (page: Page): Locator => page.getByTestId('statistics-add-menu-item');
export const getCancelBtn = (page: Page): Locator => page.getByTestId('statistics-cancel-btn');
export const getSaveBtn = (page: Page): Locator => page.getByTestId('statistics-save-btn');

// Empty state
export const getEmptyState = (page: Page): Locator => page.getByTestId('statistics-empty');

// Stat card list
export const getStatCardList = (page: Page): Locator => page.getByTestId('stat-card-list');
export const getStatCardScrollableList = (page: Page): Locator => getStatCardList(page).locator('.stat-card-list');
export const getStatCardItems = (page: Page): Locator => page.getByTestId('stat-card-item');
export const getStatCardDraggers = (page: Page): Locator => page.getByTestId('stat-card-dragger');
export const getStatCardDeleteBtns = (page: Page): Locator => page.getByTestId('stat-card-delete-btn');
export const getStatCardEditBtns = (page: Page): Locator => page.getByTestId('stat-card-edit-btn');

// Chart widget list
export const getChartWidgetList = (page: Page): Locator => page.getByTestId('chart-widget-list');
export const getChartWidgetItems = (page: Page): Locator => page.getByTestId('chart-widget-item');
export const getChartWidgetDraggers = (page: Page): Locator => page.getByTestId('chart-widget-dragger');
export const getChartWidgetDeleteBtns = (page: Page): Locator => page.getByTestId('chart-widget-delete-btn');
export const getChartWidgetEditBtns = (page: Page): Locator => page.getByTestId('chart-widget-edit-btn');
export const getChartWidgetResizeHandle = (item: Locator): Locator =>
	item.locator('.gridster-item-resizable-handler.handle-e');

// Catalog dialog
export const getCatalogDialog = (page: Page): Locator => page.getByTestId('catalog-dialog');
export const getCatalogTabAll = (page: Page): Locator => page.getByRole('tab', { name: 'All' });
export const getCatalogTabCards = (page: Page): Locator => page.getByRole('tab', { name: 'Cards' });
export const getCatalogItems = (page: Page): Locator => page.getByTestId('catalog-item');
export const getCatalogItemInfoBtns = (page: Page): Locator => page.getByTestId('catalog-item-info-btn');
export const getCatalogNextBtn = (page: Page): Locator => page.getByTestId('catalog-next-btn');
export const getCatalogBackBtn = (page: Page): Locator => page.getByTestId('catalog-back-btn');
export const getCatalogCreateBtn = (page: Page): Locator => page.getByTestId('catalog-create-btn');
export const getCatalogTitleInput = (page: Page): Locator => page.getByTestId('catalog-title-input');
export const getCatalogCategorySelect = (page: Page): Locator => page.getByTestId('catalog-category-select');
export const getCatalogSelectAllBtn = (page: Page): Locator => page.getByTestId('catalog-select-all-btn');
export const getCatalogDeselectAllBtn = (page: Page): Locator => page.getByTestId('catalog-deselect-all-btn');
export const getCatalogTooltip = (page: Page): Locator => page.locator('mat-tooltip-component');

// Edit chart dialog
export const getEditChartDialog = (page: Page): Locator => page.getByTestId('edit-chart-dialog');
export const getEditChartTitleInput = (page: Page): Locator => page.getByTestId('edit-chart-title-input');
export const getEditChartCancelBtn = (page: Page): Locator => page.getByTestId('edit-chart-cancel-btn');
export const getEditChartSaveBtn = (page: Page): Locator => page.getByTestId('edit-chart-save-btn');
export const getEditChartCategorySelect = (page: Page): Locator => getEditChartDialog(page).locator('mat-select');

// Form validation
export const getFirstFormError = (page: Page): Locator => page.locator('mat-error').first();

// Confirm exit dialog
export const getConfirmExitContinueBtn = (page: Page): Locator =>
	page.getByTestId('action-btn').filter({ hasText: 'Continue' });
