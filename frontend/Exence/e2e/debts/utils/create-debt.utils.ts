import { expect, Locator, Page } from '@playwright/test';
import { fillAndBlur, formatDateForInput } from '../../form/utils/form-utils';
import { getSnackbarCloseBtn, getSuccessSnackbar } from '../../snackbar/locators/snackbar-locators';
import debtsData from '../data/debts.data.json';
import {
	getCreateDebtDialog,
	getDebtCategorySelect,
	getDebtCounterpartyInput,
	getDebtCreateBtnInner,
	getDebtCurrencySelect,
	getDebtDeadlineInput,
	getDebtOriginalAmountInput,
	getDebtTitleInput,
	getDebtTypeSelect,
	getEditDebtDialog,
	getFirstCategoryOption,
} from '../locators/debts-dialog-locators';
import {
	getDebtBorrowedList,
	getDebtBorrowedListAddBtn,
	getDebtBorrowedListRows,
	getDebtDeleteAction,
	getDebtEditAction,
	getDebtLentList,
	getDebtLentListAddBtn,
	getDebtLentListRows,
	getDebtMenuTrigger,
} from '../locators/debts-locators';

export interface CreateDebtData {
	title?: string;
	counterpartyName?: string;
	originalAmount?: number;
	currency?: string;
	type?: string;
	deadline?: Date;
}

export async function createDebt(page: Page, openBtn: Locator, data: Partial<CreateDebtData> = {}): Promise<void> {
	const merged = {
		title: data.title ?? debtsData.createDebt.title,
		counterpartyName: data.counterpartyName ?? debtsData.createDebt.counterpartyName,
		originalAmount: data.originalAmount ?? debtsData.createDebt.originalAmount,
		currency: data.currency ?? debtsData.createDebt.currency,
		type: data.type ?? debtsData.createDebt.type,
		deadline: data.deadline,
	};

	await openBtn.click();
	await expect(getCreateDebtDialog(page)).toBeVisible();

	await fillAndBlur(getDebtTitleInput(page), merged.title);
	await fillAndBlur(getDebtCounterpartyInput(page), merged.counterpartyName);

	await getDebtOriginalAmountInput(page).fill(String(merged.originalAmount));
	await getDebtOriginalAmountInput(page).blur();

	await getDebtCurrencySelect(page).click();
	await page.locator('mat-option').filter({ hasText: merged.currency }).first().click();

	await getDebtTypeSelect(page).click();
	await page.locator('mat-option').filter({ hasText: merged.type }).first().click();

	if (merged.deadline) {
		await fillAndBlur(getDebtDeadlineInput(page), formatDateForInput(merged.deadline));
	}

	await getDebtCategorySelect(page).click();
	await getFirstCategoryOption(page).click();

	await getDebtCreateBtnInner(page).click();

	await expect(getSuccessSnackbar(page)).toBeVisible();
	await getSnackbarCloseBtn(page).last().click();
}

export async function deleteDebt(page: Page, list: Locator): Promise<void> {
	const firstRow = list.getByTestId('data-row').first();
	await firstRow.click();
	await getDebtMenuTrigger(firstRow).click();
	await getDebtDeleteAction(page).click();
}

export async function deleteAllDebts(page: Page): Promise<void> {
	while (await getDebtLentListRows(page).first().isVisible()) {
		await deleteDebt(page, getDebtLentList(page));
		await page.waitForTimeout(100);
	}

	while (await getDebtBorrowedListRows(page).first().isVisible()) {
		await deleteDebt(page, getDebtBorrowedList(page));
		await page.waitForTimeout(100);
	}
}

export async function openCreateBorrowDialog(page: Page): Promise<void> {
	await getDebtBorrowedListAddBtn(page).click();
	await expect(getCreateDebtDialog(page)).toBeVisible();
	await expect(getDebtTypeSelect(page)).toHaveText(debtsData.typeOption.borrowed);
}

export async function openCreateLendDialog(page: Page): Promise<void> {
	await getDebtLentListAddBtn(page).click();
	await expect(getCreateDebtDialog(page)).toBeVisible();
	await expect(getDebtTypeSelect(page)).toHaveText(debtsData.typeOption.lent);
}

export async function openEditBorrowDialog(page: Page): Promise<void> {
	const firstRow = getDebtBorrowedListRows(page).first();
	await firstRow.click();
	await getDebtMenuTrigger(firstRow).click();
	await getDebtEditAction(page).click();
	await expect(getEditDebtDialog(page)).toBeVisible();
}

export async function openEditLendDialog(page: Page): Promise<void> {
	const firstRow = getDebtLentListRows(page).first();
	await firstRow.click();
	await getDebtMenuTrigger(firstRow).click();
	await getDebtEditAction(page).click();
	await expect(getEditDebtDialog(page)).toBeVisible();
}

export async function openEditDialogForSpecificRow(page: Page, row: Locator): Promise<void> {
	await row.click();
	await getDebtMenuTrigger(row).click();
	await getDebtEditAction(page).click();
	await expect(getEditDebtDialog(page)).toBeVisible();
}
