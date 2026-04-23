import { BrowserContext, expect, Page } from '@playwright/test';
import { registerAndLogin } from '../../../auth/auth';
import { openProfileDialog } from '../../utils/setup-profile-dialog.util';
import { getProfileActivity, getProfileDialog } from '../../locators/profile-dialog-locators';
import { getAuditLogList } from '../locators/workspace-activity-locators';
import { getTransactionList, getTransactionRow, getTransactionMenuTrigger } from '../../../transactions/locators/transactions-locators';
import { createDefaultCategoryOnTransactionsPage } from '../../../transactions/utils/setup-transactions.utils';
import { getListAddBtn, getRowActionDelete, getRowActionEdit } from '../../../transaction/locators/transaction-list-locators';
import { getCreateTransactionDialog } from '../../../transaction/locators/transaction-dialog-locators';
import { getEditSaveBtn, getEditSaveBtnInner, getEditTitleInput, getEditTransactionDialog } from '../../../transaction/edit-transaction-dialog/locators/edit-transaction-dialog-locators';
import { createExpense } from '../../../common/utils/create-transaction.utils';
import { createUniqueName, fillAndBlur } from '../../../form/utils/form-utils';
import activityData from '../data/workspace-activity.data.json';

export async function setupWorkspaceActivityEmpty(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await registerAndLogin(page);
	await page.evaluate(() => localStorage.setItem('language', 'en'));
	await openProfileDialog(page);
	await expect(getProfileDialog(page)).toBeVisible();
	await getProfileActivity(page).click();
	await expect(getAuditLogList(page)).toBeVisible();
}

export async function setupWorkspaceActivityWithActions(page: Page, context: BrowserContext): Promise<void> {
	await context.clearCookies({ domain: 'localhost' });
	await page.addInitScript(() => {
		localStorage.setItem('language', 'en');
		localStorage.removeItem('themePreference');
	});
	await registerAndLogin(page);
	await page.evaluate(() => localStorage.setItem('language', 'en'));

	await page.goto('/transactions', { waitUntil: 'domcontentloaded' });
	await page.waitForURL('**/transactions');

	await createDefaultCategoryOnTransactionsPage(page);

	const transactionTitle = `${activityData.transaction.title} ${createUniqueName()}`;
	await expect(getTransactionList(page)).toBeVisible();
	await getListAddBtn(getTransactionList(page)).click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
	await createExpense(page, { title: transactionTitle, amount: activityData.transaction.amount });
	await expect(getCreateTransactionDialog(page)).not.toBeVisible();

	const row = getTransactionRow(page, transactionTitle);
	await row.waitFor({ state: 'visible' });
	await row.click();
	await getTransactionMenuTrigger(page).waitFor({ state: 'visible' });
	await getTransactionMenuTrigger(page).click();
	await getRowActionEdit(page).click();
	await expect(getEditTransactionDialog(page)).toBeVisible();

	const titleInput = getEditTitleInput(page);
	await titleInput.clear();
	await fillAndBlur(titleInput, activityData.transaction.updatedTitle);
	await expect(getEditSaveBtnInner(page)).not.toBeDisabled();
	await getEditSaveBtn(page).click();
	await expect(getEditTransactionDialog(page)).not.toBeVisible();

	const updatedRow = getTransactionRow(page, activityData.transaction.updatedTitle);
	await updatedRow.waitFor({ state: 'visible' });
	await updatedRow.click();
	await getTransactionMenuTrigger(page).waitFor({ state: 'visible' });
	await getTransactionMenuTrigger(page).click();
	await getRowActionDelete(page).click();

	await openProfileDialog(page);
	await expect(getProfileDialog(page)).toBeVisible();
	await getProfileActivity(page).click();
	await expect(getAuditLogList(page)).toBeVisible();
}
