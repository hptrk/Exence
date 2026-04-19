import { expect, test } from '@playwright/test';
import { setupTransactions } from '../../../transactions/utils/setup-transactions.utils';
import { getRecurringExpensesList } from '../../../transactions/locators/transactions-locators';
import { getListAddBtn } from '../../locators/transaction-list-locators';
import {
	getCreateTransactionDialog,
	getTransactionAmountInput,
	getTransactionCreateBtnInner,
	getTransactionTitleInput,
} from '../../locators/transaction-dialog-locators';
import {
	getDayOfMonthSelector,
	getDayOfWeekSelector,
	getRecurringConfig,
	getRecurringEndConditionSelect,
	getRecurringFrequencySelect,
	getRecurringIntervalInput,
	getRecurringMaxOccurrencesInput,
} from '../locators/recurring-transaction-locators';
import { createDefaultCategoryOnTransactionsPage as createDefaultCategory } from '../../../transactions/utils/setup-transactions.utils';
import { fillAndBlur } from '../../../form/utils/form-utils';
import recurringData from '../data/recurring-transaction.data.json';

test.describe('Recurring transaction dialog — validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await createDefaultCategory(page);
		await getListAddBtn(getRecurringExpensesList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await expect(getRecurringConfig(page)).toBeVisible();
	});

	test('recurring config section shows interval and frequency fields', async ({ page }) => {
		await expect(getRecurringConfig(page)).toBeVisible();
		await expect(getRecurringIntervalInput(page)).toBeVisible();
		await expect(getRecurringFrequencySelect(page)).toBeVisible();
	});

	test('title required — create button disabled when title is empty', async ({ page }) => {
		await getTransactionTitleInput(page).clear();
		await getTransactionTitleInput(page).blur();
		await expect(getTransactionCreateBtnInner(page)).toBeDisabled();
	});

	test('title required error shown when touched and empty', async ({ page }) => {
		await getTransactionTitleInput(page).click();
		await getTransactionTitleInput(page).clear();
		await getTransactionTitleInput(page).blur();
		await expect(page.getByText(recurringData.errors.required)).toBeVisible();
	});

	test('title max length 255 — error when 256 characters entered', async ({ page }) => {
		const longTitle = recurringData.validation.titleTooLongChar.repeat(recurringData.validation.titleMaxLength + 1);
		await fillAndBlur(getTransactionTitleInput(page), longTitle);
		await expect(page.getByText(recurringData.errors.maxLength255)).toBeVisible();
		await expect(getTransactionCreateBtnInner(page)).toBeDisabled();
	});

	test('amount required — create button disabled when amount is cleared', async ({ page }) => {
		await fillAndBlur(getTransactionTitleInput(page), recurringData.valid.title);
		const amountInput = getTransactionAmountInput(page);
		await amountInput.clear();
		await amountInput.blur();
		await expect(getTransactionCreateBtnInner(page)).toBeDisabled();
	});

	test('amount min value 1 — error when set to 0', async ({ page }) => {
		await fillAndBlur(getTransactionTitleInput(page), recurringData.valid.title);
		const amountInput = getTransactionAmountInput(page);
		await amountInput.clear();
		await fillAndBlur(amountInput, String(recurringData.validation.amountZero));
		await expect(page.getByText(recurringData.errors.min1)).toBeVisible();
		await expect(getTransactionCreateBtnInner(page)).toBeDisabled();
	});

	test('interval min value 1 — error when set to 0', async ({ page }) => {
		const intervalInput = getRecurringIntervalInput(page);
		await intervalInput.clear();
		await fillAndBlur(intervalInput, String(recurringData.validation.intervalZero));
		await expect(page.getByText(recurringData.errors.min1)).toBeVisible();
	});

	test('selecting WEEKLY frequency shows the day-of-week selector', async ({ page }) => {
		await getRecurringFrequencySelect(page).click();
		await page.getByRole('option', { name: 'week', exact: true }).click();
		await expect(getDayOfWeekSelector(page)).toBeVisible();
	});

	test('selecting MONTHLY frequency shows the day-of-month selector', async ({ page }) => {
		await getRecurringFrequencySelect(page).click();
		await page.getByRole('option', { name: 'month', exact: true }).click();
		await expect(getDayOfMonthSelector(page)).toBeVisible();
		await expect(getDayOfWeekSelector(page)).not.toBeVisible();
	});

	test('selecting YEARLY frequency hides day-of-week and day-of-month selectors', async ({ page }) => {
		await getRecurringFrequencySelect(page).click();
		await page.getByRole('option', { name: 'year', exact: true }).click();
		await expect(getDayOfWeekSelector(page)).not.toBeVisible();
		await expect(getDayOfMonthSelector(page)).not.toBeVisible();
	});

	test('end condition defaults to Never — no extra fields shown', async ({ page }) => {
		await expect(getRecurringMaxOccurrencesInput(page)).not.toBeVisible();
	});

	test('end condition UNTIL_DATE — end date required error is shown', async ({ page }) => {
		await getRecurringEndConditionSelect(page).click();
		await page.getByRole('option', { name: recurringData.endCondition.untilDate, exact: true }).click();
		await expect(page.getByText(recurringData.errors.endDateRequired)).toBeVisible();
	});

	test('end condition AFTER_OCCURRENCES — max occurrences field appears', async ({ page }) => {
		await getRecurringEndConditionSelect(page).click();
		await page.getByRole('option', { name: recurringData.endCondition.afterOccurrences, exact: true }).click();
		await expect(getRecurringMaxOccurrencesInput(page)).toBeVisible();
	});

	test('max occurrences min value 1 — error when set to 0', async ({ page }) => {
		await getRecurringEndConditionSelect(page).click();
		await page.getByRole('option', { name: recurringData.endCondition.afterOccurrences, exact: true }).click();
		const maxOccInput = getRecurringMaxOccurrencesInput(page);
		await maxOccInput.clear();
		await fillAndBlur(maxOccInput, String(recurringData.validation.maxOccurrencesZero));
		await expect(page.getByText(recurringData.errors.min1)).toBeVisible();
	});
});
