import { expect, BrowserContext, Page } from '@playwright/test';
import { attemptLogin } from '../../auth/auth';
import { createExpense } from '../../common/utils/create-transaction.utils';
import { createUniqueName, fillAndBlur } from '../../form/utils/form-utils';
import {
	getEditSaveBtn,
	getEditSaveBtnInner,
	getEditTitleInput,
	getEditTransactionDialog,
} from '../../transaction/edit-transaction-dialog/locators/edit-transaction-dialog-locators';
import { getCreateTransactionDialog } from '../../transaction/locators/transaction-dialog-locators';
import {
	getListAddBtn,
	getListDataRowMenuTriggerBtn,
	getRowActionDelete,
	getRowActionEdit,
} from '../../transaction/locators/transaction-list-locators';
import { getTransactionList, getTransactionRow } from '../../transactions/locators/transactions-locators';

export async function setupAdmin(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'admin');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await page.goto('/admin', { waitUntil: 'domcontentloaded' });
}

export async function setupAdminLogs(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await attemptLogin(page, 'admin');
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await page.goto('/transactions', { waitUntil: 'domcontentloaded' });
	await page.waitForURL('**/transactions');

	const title = createUniqueName();
	await getListAddBtn(getTransactionList(page)).click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
	await createExpense(page, { title, amount: 100 });
	await expect(getCreateTransactionDialog(page)).not.toBeVisible();

	const row = getTransactionRow(page, title);
	await row.waitFor({ state: 'visible' });
	await row.click();
	await getListDataRowMenuTriggerBtn(row).waitFor({ state: 'visible' });
	await getListDataRowMenuTriggerBtn(row).click();
	await getRowActionEdit(page).click();
	await expect(getEditTransactionDialog(page)).toBeVisible();
	const updatedTitle = createUniqueName();
	const editInput = getEditTitleInput(page);
	await editInput.clear();
	await fillAndBlur(editInput, updatedTitle);
	await expect(getEditSaveBtnInner(page)).not.toBeDisabled();
	await getEditSaveBtn(page).click();
	await expect(getEditTransactionDialog(page)).not.toBeVisible();

	const updatedRow = getTransactionRow(page, updatedTitle);
	await updatedRow.waitFor({ state: 'visible' });
	await getListDataRowMenuTriggerBtn(updatedRow).waitFor({ state: 'visible' });
	await getListDataRowMenuTriggerBtn(updatedRow).click();
	await getRowActionDelete(page).click();
	await expect(updatedRow).not.toBeVisible();

	await page.goto('/admin', { waitUntil: 'domcontentloaded' });
}
