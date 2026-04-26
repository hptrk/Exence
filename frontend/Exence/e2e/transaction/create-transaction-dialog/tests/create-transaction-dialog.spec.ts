import { expect, test } from '@playwright/test';
import { fillAndBlur, getCurrentDate } from '../../../form/utils/form-utils';
import { getSnackbar } from '../../../snackbar/locators/snackbar-locators';
import { getTransactionList } from '../../../transactions/locators/transactions-locators';
import {
	createDefaultCategoryOnTransactionsPage as createDefaultCategory,
	setupTransactions,
} from '../../../transactions/utils/setup-transactions.utils';
import {
	getCreateTransactionDialog,
	getFirstMatOption,
	getRecurringConfig,
	getTransactionAmountInput,
	getTransactionCategorySelect,
	getTransactionCreateBtn,
	getTransactionCreateBtnInner,
	getTransactionCurrencyOption,
	getTransactionCurrencySelect,
	getTransactionDateInput,
	getTransactionDialogCloseBtn,
	getTransactionRecurringCheckbox,
	getTransactionTitleInput,
	getTransactionTypeToggle,
} from '../../locators/transaction-dialog-locators';
import { getListAddBtn } from '../../locators/transaction-list-locators';
import data from '../data/create-transaction-dialog.data.json';
import { fillValidForm, formatTitle } from '../utils/create-transaction-dialog.utils';
import {
	getCalendar,
	getCalendarDayCell,
	getCalendarDisabledCells,
	getCalendarEnabledCells,
	getCalendarNextButton,
	getConfirmExitCancelBtn,
	getConfirmExitContinueBtn,
	getConfirmExitDialog,
	getDayOfMonthOption,
	getDayOfMonthSelector,
	getDayOfWeekOption,
	getDayOfWeekSelector,
	getExchangeRateInput,
	getExchangeRateStepper,
	getFrequencyOption,
	getFrequencySelect,
	getStartDateToggle,
	getTooltipSurface,
} from '../locators/create-transaction-dialog-locators';

async function openDialog(page: Parameters<typeof getCreateTransactionDialog>[0]): Promise<void> {
	await getListAddBtn(getTransactionList(page)).click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
}

// Structure
test.describe('Create transaction dialog - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openDialog(page);
	});

	test('dialog is visible after clicking add', async ({ page }) => {
		await expect(getCreateTransactionDialog(page)).toBeVisible();
	});

	test('should EXPENSE type be selected by default', async ({ page }) => {
		const toggle = getTransactionTypeToggle(page);
		await expect(toggle.locator('mat-button-toggle.mat-button-toggle-checked')).toContainText('EXPENSE');
	});

	test('should create button be disabled on init', async ({ page }) => {
		await expect(getTransactionCreateBtnInner(page)).toBeDisabled();
	});

	test('should recurring config section is hidden by default', async ({ page }) => {
		await expect(getRecurringConfig(page)).not.toBeVisible();
	});

	test('should recurring config section appear when recurring checkbox is checked', async ({ page }) => {
		await getTransactionRecurringCheckbox(page).click();
		await expect(getRecurringConfig(page)).toBeVisible();
	});
});

// Validators
test.describe('Create transaction dialog - validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openDialog(page);
	});

	// Title
	test('should display title required validator', async ({ page }) => {
		await getTransactionTitleInput(page).click();
		await getTransactionTitleInput(page).blur();
		await expect(page.getByText(data.errors.required)).toBeVisible();
	});

	test('should display title maxlength validator', async ({ page }) => {
		const long = data.validation.tooLongChar.repeat(data.validation.titleMaxLength + 1);
		await fillAndBlur(getTransactionTitleInput(page), long);
		await expect(page.getByText(data.errors.maxLength255)).toBeVisible();
		await expect(getTransactionCreateBtnInner(page)).toBeDisabled();
	});

	// amount
	test('should display amount required validator', async ({ page }) => {
		await getTransactionAmountInput(page).click();
		await getTransactionAmountInput(page).blur();
		await expect(page.getByText(data.errors.required)).toBeVisible();
	});

	test('should amount be minimum 1', async ({ page }) => {
		const amountInput = getTransactionAmountInput(page);
		await amountInput.clear();
		await fillAndBlur(amountInput, String(data.validation.amountZero));
		await expect(page.getByText(data.errors.min1)).toBeVisible();
		await expect(getTransactionCreateBtnInner(page)).toBeDisabled();
	});

	// Note
	test('should note max 500 - shows error when exceeded', async ({ page }) => {
		const noteInput = getCreateTransactionDialog(page).locator('textarea');
		await fillAndBlur(noteInput, data.validation.tooLongChar.repeat(data.validation.noteMaxLength + 1));
		await expect(page.getByText(data.errors.maxLength500)).toBeVisible();
	});
});

// Confirm exit dialog
test.describe('Create transaction dialog - confirm exit', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openDialog(page);
		// Dirty the form so the exit guard activates
		await fillAndBlur(getTransactionTitleInput(page), `${data.title} ${getCurrentDate()}`);
	});

	test('should show confirm exit dialog when clicking close button', async ({ page }) => {
		await getTransactionDialogCloseBtn(page).click();
		await expect(getConfirmExitDialog(page)).toBeVisible();
		await expect(getConfirmExitDialog(page)).toContainText(data.confirmExit.title);
	});

	test('should not close dialog when form is dirty by pressing Escape key', async ({ page }) => {
		await page.keyboard.press('Escape');
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await expect(getConfirmExitDialog(page)).not.toBeVisible();
	});

	test('shuold clicking Continue in confirm dialog close the create transaction dialog', async ({ page }) => {
		await getTransactionDialogCloseBtn(page).click();
		await expect(getConfirmExitDialog(page)).toBeVisible();
		await getConfirmExitContinueBtn(page).click();
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();
	});

	test('should clicking Cancel in confirm dialog keep create transaction dialog open', async ({ page }) => {
		await getTransactionDialogCloseBtn(page).click();
		await expect(getConfirmExitDialog(page)).toBeVisible();
		await getConfirmExitCancelBtn(page).click();
		await expect(getConfirmExitDialog(page)).not.toBeVisible();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
	});
});

// Recurring - disabled fields
test.describe('Create transaction dialog - recurring: disabled fields', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openDialog(page);
	});

	test('should date input be disabled when recurring is checked', async ({ page }) => {
		await getTransactionRecurringCheckbox(page).click();
		await expect(getTransactionDateInput(page)).toBeDisabled();
	});

	test('should exchange rate input be disabled when recurring is checked', async ({ page }) => {
		await expect(getExchangeRateInput(page)).not.toBeDisabled();
		await getTransactionRecurringCheckbox(page).click();
		await expect(getExchangeRateInput(page)).toBeDisabled();
	});

	test('should date field show tooltip when recurring is enabled', async ({ page }) => {
		await getTransactionRecurringCheckbox(page).click();
		await expect(getTransactionDateInput(page)).toBeDisabled();
		const dateFormField = page.locator('mat-form-field').filter({ has: getTransactionDateInput(page) });
		await dateFormField.hover();
		await expect(getTooltipSurface(page)).toContainText(data.tooltips.recurringDisabled);
	});

	test('should exchange rate field show tooltip when recurring is enabled', async ({ page }) => {
		await expect(getExchangeRateInput(page)).not.toBeDisabled();
		await getTransactionRecurringCheckbox(page).click();
		await expect(getExchangeRateInput(page)).toBeDisabled();
		await getExchangeRateStepper(page).hover();
		await expect(getTooltipSurface(page)).toContainText(data.tooltips.recurringDisabled);
	});

	test('should date input be re-enabled when recurring is unchecked', async ({ page }) => {
		await getTransactionRecurringCheckbox(page).click();
		await expect(getTransactionDateInput(page)).toBeDisabled();
		await getTransactionRecurringCheckbox(page).click();
		await expect(getTransactionDateInput(page)).not.toBeDisabled();
	});

	test('should exchange rate input be re-enabled when recurring is unchecked', async ({ page }) => {
		await expect(getExchangeRateInput(page)).not.toBeDisabled();
		await getTransactionRecurringCheckbox(page).click();
		await expect(getExchangeRateInput(page)).toBeDisabled();
		await getTransactionRecurringCheckbox(page).click();
		await expect(getExchangeRateInput(page)).not.toBeDisabled();
	});
});

// Recurring: frequency selectors
test.describe('Create transaction dialog - recurring: frequency selectors', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openDialog(page);
		await getTransactionRecurringCheckbox(page).click();
		await expect(getRecurringConfig(page)).toBeVisible();
	});

	test('should frequency select be visible', async ({ page }) => {
		await expect(getFrequencySelect(page)).toBeVisible();
	});

	test('should day-of-week selector be visible when frequency is WEEKLY', async ({ page }) => {
		await expect(getDayOfWeekSelector(page)).toBeVisible();
	});

	test('should day-of-month selector not be visible when frequency is WEEKLY', async ({ page }) => {
		await expect(getDayOfMonthSelector(page)).not.toBeVisible();
	});

	test('should day-of-month selector be visible when frequency is MONTHLY', async ({ page }) => {
		await getFrequencySelect(page).click();
		await getFrequencyOption(page, data.recurring.frequency.monthly).click();
		await expect(getDayOfMonthSelector(page)).toBeVisible();
	});

	test('should day-of-week selector not be visible when frequency is MONTHLY', async ({ page }) => {
		await getFrequencySelect(page).click();
		await getFrequencyOption(page, data.recurring.frequency.monthly).click();
		await expect(getDayOfWeekSelector(page)).not.toBeVisible();
	});

	test('should neither day-of-week nor day-of-month selector be visible when frequency is YEARLY', async ({
		page,
	}) => {
		await getFrequencySelect(page).click();
		await getFrequencyOption(page, data.recurring.frequency.yearly).click();
		await expect(getDayOfWeekSelector(page)).not.toBeVisible();
		await expect(getDayOfMonthSelector(page)).not.toBeVisible();
	});
});

// Recurring: WEEKLY date filter
test.describe('Create transaction dialog - recurring: weekly date filter', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openDialog(page);
		await getTransactionRecurringCheckbox(page).click();
		await expect(getDayOfWeekSelector(page)).toBeVisible();
		await getDayOfWeekOption(page, data.recurring.dayOfWeek.mondayShort).click();
	});

	test('start date picker disables non-Monday dates when WEEKLY + Monday selected', async ({ page }) => {
		await getStartDateToggle(page).click();
		const calendar = getCalendar(page);
		await calendar.waitFor({ state: 'visible' });

		// Enabled cells should all be Mondays
		const enabledCells = getCalendarEnabledCells(page);
		const enabledCount = await enabledCells.count();
		expect(enabledCount).toBeGreaterThan(0);

		for (let i = 0; i < enabledCount; i++) {
			const ariaLabel = await enabledCells.nth(i).getAttribute('aria-label');
			if (ariaLabel) {
				const date = new Date(ariaLabel);
				expect(date.getDay()).toBe(1); // 1 = Monday
			}
		}

		// There should be many more disabled than enabled cells
		const disabledCount = await getCalendarDisabledCells(page).count();
		expect(disabledCount).toBeGreaterThan(enabledCount);
	});
});

// Recurring: MONTHLY date filter
test.describe('Create transaction dialog - recurring: monthly date filter', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openDialog(page);
		await getTransactionRecurringCheckbox(page).click();
		await expect(getRecurringConfig(page)).toBeVisible();
		// Switch to MONTHLY frequency
		await getFrequencySelect(page).click();
		await getFrequencyOption(page, data.recurring.frequency.monthly).click();
		await expect(getDayOfMonthSelector(page)).toBeVisible();
		// Select day 15
		await getDayOfMonthOption(page, data.recurring.dayOfMonth).click();
	});

	test('start date picker disables non-15th dates when MONTHLY + day 15 selected', async ({ page }) => {
		await getStartDateToggle(page).click();
		const calendar = getCalendar(page);
		await calendar.waitFor({ state: 'visible' });

		// Navigate to next month to guarantee day 15 is in the future
		await getCalendarNextButton(page).click();

		// Day 15 should be enabled (valid selection)
		const targetCell = getCalendarDayCell(page, data.recurring.dayOfMonth);
		await expect(targetCell).not.toHaveAttribute('aria-disabled', 'true');

		// An adjacent day (16) should be disabled
		const adjacentCell = getCalendarDayCell(page, data.recurring.dayOfMonth + 1);
		await expect(adjacentCell).toHaveAttribute('aria-disabled', 'true');

		// There should be many more disabled than enabled cells in this month view
		const enabledCount = await getCalendarEnabledCells(page).count();
		const disabledCount = await getCalendarDisabledCells(page).count();
		expect(disabledCount).toBeGreaterThan(enabledCount);
	});
});

// Exchange rate API call
test.describe('Create transaction dialog - exchange rate API', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openDialog(page);
	});

	test('changing currency triggers request to /api/exchange-rates with from=EUR', async ({ page }) => {
		// Wait for initial exchange rate fetch to settle
		await expect(getExchangeRateInput(page)).not.toBeDisabled();

		const [request] = await Promise.all([
			page.waitForRequest(req => req.url().includes(data.api.exchangeRates) && req.url().includes('EUR')),
			(async () => {
				await getTransactionCurrencySelect(page).click();
				await getTransactionCurrencyOption(page, data.foreignCurrency).click();
			})(),
		]);

		expect(request.url()).toContain(data.api.exchangeRates);
		expect(request.url()).toContain('EUR');
	});
});

// Submission
test.describe('Create transaction dialog - submission', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await createDefaultCategory(page);
		await openDialog(page);
	});

	test('non-recurring transaction sends POST to /api/transactions', async ({ page }) => {
		const title = `${data.title} ${getCurrentDate()}`;
		await fillValidForm(page, title);

		const [request] = await Promise.all([
			page.waitForRequest(
				req =>
					req.url().includes(data.api.transactions) &&
					!req.url().includes('recurring') &&
					req.method() === 'POST',
			),
			getTransactionCreateBtn(page).click(),
		]);

		expect(request.url()).toContain(data.api.transactions);
		expect(request.url()).not.toContain('recurring');
		expect(request.method()).toBe('POST');
	});

	test('recurring transaction sends POST to /api/transactions/recurring', async ({ page }) => {
		await getTransactionRecurringCheckbox(page).click();
		const title = `${data.title} ${getCurrentDate()}`;
		await fillAndBlur(getTransactionTitleInput(page), title);
		const amountInput = getTransactionAmountInput(page);
		await amountInput.clear();
		await fillAndBlur(amountInput, String(data.amount));
		await getTransactionCategorySelect(page).click();
		await getFirstMatOption(page).waitFor({ state: 'visible' });
		await getFirstMatOption(page).click();

		const [request] = await Promise.all([
			page.waitForRequest(req => req.url().includes(data.api.recurring) && req.method() === 'POST'),
			getTransactionCreateBtn(page).click(),
		]);

		expect(request.url()).toContain(data.api.recurring);
		expect(request.method()).toBe('POST');
	});

	test('success snackbar shows transaction title after creation', async ({ page }) => {
		const title = `${data.title} ${getCurrentDate()}`;
		await fillValidForm(page, title);
		await getTransactionCreateBtn(page).click();
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();
		await expect(getSnackbar(page)).toContainText(`Transaction '${formatTitle(title)}' created successfully!`);
	});
});
