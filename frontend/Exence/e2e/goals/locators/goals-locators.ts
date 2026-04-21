import { Locator, Page } from '@playwright/test';

// Empty state
export const getGoalsEmptyState = (page: Page): Locator => page.getByTestId('goals-empty-state');
export const getGoalsEmptyCreateBtn = (page: Page): Locator => page.getByTestId('goals-empty-create-btn');

// Statistics section
export const getGoalStatCards = (page: Page): Locator => page.getByTestId('goal-stat-cards');
export const getGoalChartGrid = (page: Page): Locator => page.getByTestId('goal-chart-grid');
export const getGoalProgressTrendSelect = (page: Page): Locator => getGoalChartGrid(page).locator('mat-select').first();

// List section
export const getGoalListAddBtn = (page: Page): Locator => page.getByTestId('add-btn');
export const getGoalListRows = (page: Page): Locator => page.getByTestId('data-row');
export const getGoalStatusIndicator = (row: Locator): Locator => row.getByTestId('goal-status-indicator');
export const getGoalMenuTrigger = (row: Locator): Locator => row.getByTestId('menu-trigger-btn');
export const getGoalProgressBar = (page: Page): Locator => page.locator('mat-progress-bar').first();
export const getGoalDeadlineHeader = (page: Page): Locator =>
	page.locator('th').filter({ hasText: 'Deadline' }).first();
export const getGoalEditAction = (page: Page): Locator => page.getByTestId('row-action-edit');
export const getGoalDeleteAction = (page: Page): Locator => page.getByTestId('row-action-delete');
export const getGoalExpandedDetails = (page: Page): Locator => page.getByTestId('goal-expanded-details');
