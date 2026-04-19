import { Locator, Page } from '@playwright/test';

export const getExchangeRateStepper = (page: Page): Locator => page.getByTestId('transaction-exchange-rate-stepper');
export const getExchangeRateInput = (page: Page): Locator =>
	page.getByTestId('transaction-exchange-rate-stepper').locator('input[type="number"]');

export const getFrequencySelect = (page: Page): Locator => page.getByTestId('recurring-frequency-select');
export const getFrequencyOption = (page: Page, label: string): Locator =>
	page.getByRole('option').filter({ hasText: label });

export const getStartDateInput = (page: Page): Locator => page.getByTestId('recurring-start-date-input');
export const getStartDateToggle = (page: Page): Locator =>
	page.getByTestId('recurring-start-date-toggle').locator('button');

export const getDayOfWeekSelector = (page: Page): Locator => page.getByTestId('day-of-week-selector');
export const getDayOfWeekOption = (page: Page, shortLabel: string): Locator =>
	page.getByTestId('day-of-week-selector').locator('dt').filter({ hasText: shortLabel });

export const getDayOfMonthSelector = (page: Page): Locator => page.getByTestId('day-of-month-selector');
export const getDayOfMonthOption = (page: Page, day: number): Locator =>
	page
		.getByTestId('day-of-month-selector')
		.locator('dt')
		.filter({ hasText: String(day) })
		.first();

export const getEndConditionOption = (page: Page, label: string): Locator =>
	page.getByRole('option').filter({ hasText: label });

const confirmExitDialogContainer = (page: Page): Locator =>
	page.locator('mat-dialog-container').filter({ hasText: 'Unsaved changes' });

export const getConfirmExitDialog = (page: Page): Locator => confirmExitDialogContainer(page);
export const getConfirmExitContinueBtn = (page: Page): Locator =>
	confirmExitDialogContainer(page).getByTestId('action-btn').filter({ hasText: 'Continue' });
export const getConfirmExitCancelBtn = (page: Page): Locator =>
	confirmExitDialogContainer(page).getByTestId('action-btn').filter({ hasText: 'Cancel' });

export const getCalendar = (page: Page): Locator => page.locator('mat-calendar');
export const getCalendarNextButton = (page: Page): Locator => page.locator('.mat-calendar-next-button');
export const getCalendarEnabledCells = (page: Page): Locator =>
	page.locator('.mat-calendar-body-cell:not([aria-disabled="true"])');
export const getCalendarDisabledCells = (page: Page): Locator =>
	page.locator('.mat-calendar-body-cell[aria-disabled="true"]');
export const getCalendarDayCell = (page: Page, day: number): Locator =>
	page.locator('.mat-calendar-body-cell', { hasText: new RegExp(`^\\s*${day}\\s*$`) });

export const getTooltipSurface = (page: Page): Locator => page.locator('.mat-mdc-tooltip-surface').last();
