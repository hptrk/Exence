import { expect, Locator, Page } from '@playwright/test';
import {
	getCreateTransactionDialog,
	getTransactionDialogCloseBtn,
	getTransactionTypeToggleChecked,
} from '../locators/transaction-dialog-locators';
import {
	createExpense,
	createIncome,
	createRecurringExpense,
	createRecurringIncome,
} from '../../common/utils/create-transaction.utils';
import { createCategory, CategoryType } from '../../common/utils/create-category.utils';
import { getCreateFirstCategoryBtn } from '../../category/locators/categories-locators';
import { getCreateCategoryDialog } from '../../category/locators/category-dialog-locators';
import transactionData from '../data/transaction.data.json';
import { createUniqueName, getCurrentDate } from '../../form/utils/form-utils';

export async function createDefaultCategory(page: Page, type?: CategoryType): Promise<void> {
	await getCreateFirstCategoryBtn(page).click();
	await expect(getCreateCategoryDialog(page)).toBeVisible();
	await createCategory(page, { name: createUniqueName(), type });
	await expect(getCreateCategoryDialog(page)).not.toBeVisible();
}

export async function assertListOpensDialogWithType(page: Page, list: Locator, expectedType: string): Promise<void> {
	await list.getByTestId('add-btn').click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
	await expect(getTransactionTypeToggleChecked(page)).toContainText(expectedType);
}

export async function assertTransactionDialogClosesOnCancel(page: Page, list: Locator): Promise<void> {
	await list.getByTestId('add-btn').click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
	await getTransactionDialogCloseBtn(page).click();
	await expect(getCreateTransactionDialog(page)).not.toBeVisible();
}

export async function createExpenseInList(page: Page, list: Locator): Promise<void> {
	const title = `${transactionData.expense.title} ${getCurrentDate()}`;
	await list.getByTestId('add-btn').click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
	await createExpense(page, { title, amount: transactionData.expense.amount });
	await expect(getCreateTransactionDialog(page)).not.toBeVisible();
	await expect(list.getByTestId('data-row').filter({ hasText: title })).toBeVisible();
}

export async function createIncomeInList(page: Page, list: Locator): Promise<void> {
	const title = `${transactionData.income.title} ${getCurrentDate()}`;
	await list.getByTestId('add-btn').click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
	await createIncome(page, { title, amount: transactionData.income.amount });
	await expect(getCreateTransactionDialog(page)).not.toBeVisible();
	await expect(list.getByTestId('data-row').filter({ hasText: title })).toBeVisible();
}

export async function createRecurringExpenseInList(page: Page, list: Locator): Promise<void> {
	const title = `${transactionData.recurringExpense.title} ${getCurrentDate()}`;
	await list.getByTestId('add-btn').click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
	await createRecurringExpense(page, { title, amount: transactionData.recurringExpense.amount });
	await expect(getCreateTransactionDialog(page)).not.toBeVisible();
	await expect(list.getByTestId('data-row').filter({ hasText: title })).not.toBeVisible();
}

export async function createRecurringIncomeInList(page: Page, list: Locator): Promise<void> {
	const title = `${transactionData.recurringIncome.title} ${getCurrentDate()}`;
	await list.getByTestId('add-btn').click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
	await createRecurringIncome(page, { title, amount: transactionData.recurringIncome.amount });
	await expect(getCreateTransactionDialog(page)).not.toBeVisible();
	await expect(list.getByTestId('data-row').filter({ hasText: title })).not.toBeVisible();
}

export async function assertMobileButtonOpensDialog(page: Page, mobileBtn: Locator): Promise<void> {
	await mobileBtn.click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
}

export async function createExpenseViaMobileButton(page: Page, mobileBtn: Locator, list: Locator): Promise<void> {
	const title = `${transactionData.expense.title} ${getCurrentDate()}`;
	await mobileBtn.click();
	await expect(getCreateTransactionDialog(page)).toBeVisible();
	await createExpense(page, { title, amount: transactionData.expense.amount });
	await expect(getCreateTransactionDialog(page)).not.toBeVisible();
	await expect(list.getByTestId('data-row').filter({ hasText: title })).toBeVisible();
}

export async function deleteFirstTransactionInList(page: Page): Promise<void> {
	await page.goto('/transactions');
	await page.waitForURL('**/transactions');
	const firstRow = page.getByTestId('data-row').first();
	await firstRow.waitFor({ state: 'visible' });
	await firstRow.click();
	const menuTrigger = page.getByTestId('menu-trigger-btn');
	await menuTrigger.waitFor({ state: 'visible' });
	await menuTrigger.click();
	await page.getByRole('menuitem', { name: 'Delete' }).click();
	await page.goto('/dashboard');
	await page.waitForURL('**/dashboard');
}
