import { Locator, Page } from '@playwright/test';

export const getRecurringConfig = (page: Page): Locator => page.getByTestId('recurring-config');
export const getRecurringIntervalInput = (page: Page): Locator =>
	page.getByTestId('recurring-config').locator('input[type="number"]').first();
export const getRecurringFrequencySelect = (page: Page): Locator =>
	page.getByTestId('recurring-config').locator('mat-select');
export const getDayOfWeekSelector = (page: Page): Locator => page.getByTestId('day-of-week-selector');
export const getDayOfMonthSelector = (page: Page): Locator => page.getByTestId('day-of-month-selector');
export const getRecurringEndConditionSelect = (page: Page): Locator =>
	page.getByTestId('recurring-end-condition-select');
export const getRecurringMaxOccurrencesInput = (page: Page): Locator =>
	page.getByTestId('recurring-max-occurrences').locator('input[type="number"]');
