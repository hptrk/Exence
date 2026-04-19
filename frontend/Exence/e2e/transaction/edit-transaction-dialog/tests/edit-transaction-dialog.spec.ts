import { expect, test } from '@playwright/test';
import { fillAndBlur, getCurrentDate } from '../../../form/utils/form-utils';
import { getSuccessSnackbar } from '../../../snackbar/locators/snackbar-locators';
import { getTransactionRow } from '../../../transactions/locators/transactions-locators';
import {
	createDefaultCategoryOnTransactionsPage as createDefaultCategory,
	setupTransactions,
} from '../../../transactions/utils/setup-transactions.utils';
import editData from '../data/edit-transaction-dialog.data.json';
import {
	getEditAmountInput,
	getEditCategorySelect,
	getEditConfirmExitCancelBtn,
	getEditConfirmExitContinueBtn,
	getEditConfirmExitDialog,
	getEditCurrencySelect,
	getEditDateInput,
	getEditDialogCloseBtn,
	getEditExchangeRateInput,
	getEditSaveBtnInner,
	getEditTitleInput,
	getEditTransactionDialog,
	getEditTypeToggleChecked,
} from '../locators/edit-transaction-dialog-locators';
import { createTransactionAndOpenEdit } from '../utils/edit-transaction-dialog.utils';

test.describe('Edit transaction dialog — prefill', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await createDefaultCategory(page);
	});

	test('dialog shows the original transaction title', async ({ page }) => {
		const title = await createTransactionAndOpenEdit(page);
		await expect(getEditTitleInput(page)).toHaveValue(title);
	});

	test('dialog shows the correct transaction type pre-selected', async ({ page }) => {
		await createTransactionAndOpenEdit(page);
		await expect(getEditTypeToggleChecked(page)).toContainText('EXPENSE');
	});

	test('dialog shows the original transaction amount', async ({ page }) => {
		await createTransactionAndOpenEdit(page);
		await expect(getEditAmountInput(page)).toHaveValue(String(editData.original.amount));
	});

	test('dialog shows the original transaction currency', async ({ page }) => {
		await createTransactionAndOpenEdit(page, { currency: editData.foreignCurrency });
		await expect(getEditCurrencySelect(page)).toContainText(editData.foreignCurrency);
	});

	test('dialog shows the original transaction exchange rate', async ({ page }) => {
		await createTransactionAndOpenEdit(page, { currency: editData.foreignCurrency });
		await expect(getEditExchangeRateInput(page)).not.toBeEmpty();
	});

	test('dialog shows the original transaction category', async ({ page }) => {
		await createTransactionAndOpenEdit(page);
		await expect(getEditCategorySelect(page)).not.toBeEmpty();
	});

	test('save button is disabled when form is pristine', async ({ page }) => {
		await createTransactionAndOpenEdit(page);
		await expect(getEditSaveBtnInner(page)).toBeDisabled();
	});
});

test.describe('Edit transaction dialog — validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await createDefaultCategory(page);
		await createTransactionAndOpenEdit(page);
	});

	test('title required — save button disabled when title is cleared', async ({ page }) => {
		await getEditTitleInput(page).clear();
		await getEditTitleInput(page).blur();
		await expect(page.getByText(editData.errors.required)).toBeVisible();
		await expect(getEditSaveBtnInner(page)).toBeDisabled();
	});

	test('title max length 255 — error when exceeding limit', async ({ page }) => {
		const longTitle = editData.validation.tooLongChar.repeat(editData.validation.titleMaxLength + 1);
		await getEditTitleInput(page).clear();
		await fillAndBlur(getEditTitleInput(page), longTitle);
		await expect(page.getByText(editData.errors.maxLength255)).toBeVisible();
		await expect(getEditSaveBtnInner(page)).toBeDisabled();
	});

	test('amount min value 1 — error when set to 0', async ({ page }) => {
		const amountInput = getEditTransactionDialog(page).locator('input[type="number"]').first();
		await amountInput.clear();
		await fillAndBlur(amountInput, String(editData.validation.amountZero));
		await expect(page.getByText(editData.errors.min1)).toBeVisible();
		await expect(getEditSaveBtnInner(page)).toBeDisabled();
	});

	test('note max length 500 — error when exceeding limit', async ({ page }) => {
		const noteInput = getEditTransactionDialog(page).locator('textarea');
		await noteInput.clear();
		await fillAndBlur(noteInput, editData.validation.tooLongChar.repeat(editData.validation.noteMaxLength + 1));
		await expect(page.getByText(editData.errors.maxLength500)).toBeVisible();
	});

	test('date required — save button disabled when date is cleared', async ({ page }) => {
		await getEditDateInput(page).clear();
		await getEditDateInput(page).blur();
		await expect(page.getByText(editData.errors.required)).toBeVisible();
		await expect(getEditSaveBtnInner(page)).toBeDisabled();
	});

	test('amount required — save button disabled when amount is cleared', async ({ page }) => {
		await getEditAmountInput(page).clear();
		await getEditAmountInput(page).blur();
		await expect(page.getByText(editData.errors.required)).toBeVisible();
		await expect(getEditSaveBtnInner(page)).toBeDisabled();
	});

	test('exchange rate min — error when set to 0', async ({ page }) => {
		await getEditExchangeRateInput(page).clear();
		await fillAndBlur(getEditExchangeRateInput(page), String(editData.validation.exchangeRateZero));
		await expect(page.getByText(editData.errors.minExchangeRate)).toBeVisible();
		await expect(getEditSaveBtnInner(page)).toBeDisabled();
	});
});

test.describe('Edit transaction dialog — confirm exit', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await createDefaultCategory(page);
		await createTransactionAndOpenEdit(page);
		// Dirty the form so the exit guard activates
		await fillAndBlur(getEditTitleInput(page), `${editData.updated.title} ${getCurrentDate()}`);
	});

	test('should show confirm exit dialog when clicking close button', async ({ page }) => {
		await getEditDialogCloseBtn(page).click();
		await expect(getEditConfirmExitDialog(page)).toBeVisible();
		await expect(getEditConfirmExitDialog(page)).toContainText(editData.confirmExit.title);
	});

	test('should not close dialog when form is dirty by pressing Escape key', async ({ page }) => {
		await page.keyboard.press('Escape');
		await expect(getEditTransactionDialog(page)).toBeVisible();
		await expect(getEditConfirmExitDialog(page)).not.toBeVisible();
	});

	test('clicking Continue in confirm dialog should close the edit transaction dialog', async ({ page }) => {
		await getEditDialogCloseBtn(page).click();
		await expect(getEditConfirmExitDialog(page)).toBeVisible();
		await getEditConfirmExitContinueBtn(page).click();
		await expect(getEditTransactionDialog(page)).not.toBeVisible();
	});

	test('clicking Cancel in confirm dialog should keep edit transaction dialog open', async ({ page }) => {
		await getEditDialogCloseBtn(page).click();
		await expect(getEditConfirmExitDialog(page)).toBeVisible();
		await getEditConfirmExitCancelBtn(page).click();
		await expect(getEditConfirmExitDialog(page)).not.toBeVisible();
		await expect(getEditTransactionDialog(page)).toBeVisible();
	});
});

test.describe('Edit transaction dialog — actions', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await createDefaultCategory(page);
	});

	test('cancel button closes the dialog without saving', async ({ page }) => {
		await createTransactionAndOpenEdit(page);
		await getEditDialogCloseBtn(page).click();
		await expect(getEditTransactionDialog(page)).not.toBeVisible();
	});

	test('saving shows success snackbar and updated title in list', async ({ page }) => {
		const originalTitle = await createTransactionAndOpenEdit(page);
		const updatedTitle = `${editData.updated.title} ${getCurrentDate()}`;

		await getEditTitleInput(page).clear();
		await fillAndBlur(getEditTitleInput(page), updatedTitle);
		await getEditSaveBtnInner(page).waitFor({ state: 'visible' });
		await expect(getEditSaveBtnInner(page)).not.toBeDisabled();
		await page.getByTestId('edit-save-btn').click();

		await expect(getEditTransactionDialog(page)).not.toBeVisible();
		await expect(getSuccessSnackbar(page)).toBeVisible();
		await expect(getTransactionRow(page, updatedTitle)).toBeVisible();
		await expect(getTransactionRow(page, originalTitle)).not.toBeVisible();
	});
});
