import { BrowserContext, expect, Page } from '@playwright/test';
import { openProfileDialog, setupProfileDialog } from '../../utils/setup-profile-dialog.util';
import { getProfileAchievements, getProfileDialog } from '../../locators/profile-dialog-locators';
import {
	setupTransactions,
	createDefaultCategoryOnTransactionsPage,
} from '../../../transactions/utils/setup-transactions.utils';
import { getTransactionList } from '../../../transactions/locators/transactions-locators';
import { getListAddBtn } from '../../../transaction/locators/transaction-list-locators';
import { getCreateTransactionDialog } from '../../../transaction/locators/transaction-dialog-locators';
import { createExpense } from '../../../common/utils/create-transaction.utils';
import { createUniqueName } from '../../../form/utils/form-utils';

export async function setupAchievements(page: Page, context: BrowserContext): Promise<void> {
	await setupProfileDialog(page, context);
	await getProfileAchievements(page).click();
}

export async function setupAchievementsUnlocked(page: Page, context: BrowserContext): Promise<void> {
	await setupTransactions(page, context);
	await page.evaluate(() => localStorage.setItem('language', 'en'));

	await createDefaultCategoryOnTransactionsPage(page);

	const transactionList = getTransactionList(page);
	await expect(transactionList).toBeVisible();

	for (let i = 0; i < 10; i++) {
		await getListAddBtn(transactionList).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, { title: createUniqueName(), amount: 100 });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();
	}

	await openProfileDialog(page);
	await expect(getProfileDialog(page)).toBeVisible();
	await getProfileAchievements(page).click();
}
