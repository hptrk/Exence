import { expect } from '@playwright/test';
import { createExpense } from '../../../common/utils/create-transaction.utils';
import { getCurrentDate } from '../../../form/utils/form-utils';
import {
	getTransactionList,
	getTransactionMenuTrigger,
	getTransactionRow,
} from '../../../transactions/locators/transactions-locators';
import { getCreateTransactionDialog } from '../../locators/transaction-dialog-locators';
import { getListAddBtn, getRowActionEdit } from '../../locators/transaction-list-locators';
import editData from '../data/edit-transaction-dialog.data.json';
import { getEditTransactionDialog } from '../locators/edit-transaction-dialog-locators';

export async function createTransactionAndOpenEdit(
	page: Parameters<typeof createExpense>[0],
	options?: { currency?: string },
): Promise<string> {
	const title = `${editData.original.title} ${getCurrentDate()}`;
	await getListAddBtn(getTransactionList(page)).click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
	await createExpense(page, { title, amount: editData.original.amount, ...options });
	await expect(getCreateTransactionDialog(page)).not.toBeVisible();

	const row = getTransactionRow(page, title);
	await row.waitFor({ state: 'visible' });
	await row.click();
	await getTransactionMenuTrigger(page).waitFor({ state: 'visible' });
	await getTransactionMenuTrigger(page).click();
	await getRowActionEdit(page).click();
	await expect(getEditTransactionDialog(page)).toBeVisible();
	return title;
}
