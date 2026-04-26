import { expect, Locator, Page } from '@playwright/test';
import { fillAndBlur, formatDateForInput } from '../../form/utils/form-utils';
import { getSnackbarCloseBtn, getSuccessSnackbar } from '../../snackbar/locators/snackbar-locators';
import investmentsData from '../data/investments.data.json';
import {
	getCreateInvestmentDialog,
	getEditInvestmentDialog,
	getInvestmentAmountInput,
	getInvestmentAssetInput,
	getInvestmentCreateBtnInner,
	getInvestmentCurrencySelect,
	getInvestmentNoteInput,
	getInvestmentPurchaseDateInput,
	getInvestmentTypeSelect,
} from '../locators/investments-dialog-locators';
import {
	getInvestmentExpandedDetails,
	getInvestmentListAddBtn,
	getInvestmentListRows,
	getInvestmentPurchaseDeleteBtns,
	getInvestmentPurchaseEditBtns,
	getInvestmentsEmptyState,
} from '../locators/investments-locators';

export interface CreateInvestmentData {
	asset?: string;
	purchaseDate?: Date;
	type?: string;
	amount?: number;
	currency?: string;
	note?: string;
}

export async function createInvestment(
	page: Page,
	openBtn: Locator,
	data: Partial<CreateInvestmentData> = {},
): Promise<void> {
	const merged = {
		asset: data.asset ?? investmentsData.createInvestment.asset,
		purchaseDate: data.purchaseDate ?? new Date(),
		type: data.type ?? investmentsData.createInvestment.type,
		amount: data.amount ?? investmentsData.createInvestment.amount,
		currency: data.currency ?? investmentsData.createInvestment.currency,
		note: data.note !== undefined ? data.note : investmentsData.createInvestment.note,
	};

	await openBtn.click();
	await expect(getCreateInvestmentDialog(page)).toBeVisible();

	await fillAndBlur(getInvestmentAssetInput(page), merged.asset);

	await fillAndBlur(getInvestmentPurchaseDateInput(page), formatDateForInput(merged.purchaseDate));

	await getInvestmentTypeSelect(page).click();
	await page.locator('mat-option').filter({ hasText: merged.type }).first().click();

	await getInvestmentAmountInput(page).fill(String(merged.amount));
	await getInvestmentAmountInput(page).blur();

	await getInvestmentCurrencySelect(page).click();
	await page.locator('mat-option').filter({ hasText: merged.currency }).first().click();

	await fillAndBlur(getInvestmentNoteInput(page), merged.note);

	await getInvestmentCreateBtnInner(page).click();

	await expect(getSuccessSnackbar(page)).toBeVisible();
	await getSnackbarCloseBtn(page).last().click();
}

export async function deleteInvestment(page: Page, list: Locator): Promise<void> {
	const firstRow = list.getByTestId('data-row').first();
	await firstRow.click();
	await getInvestmentPurchaseDeleteBtns(page).first().click();
}

export async function openCreateDialog(page: Page): Promise<void> {
	await getInvestmentListAddBtn(page).click();
	await expect(getCreateInvestmentDialog(page)).toBeVisible();
}

export async function openEditDialog(page: Page): Promise<void> {
	const list = page.locator('ex-investment-list');
	const firstRow = list.getByTestId('data-row').first();
	await firstRow.click();
	await getInvestmentPurchaseEditBtns(page).first().click();
	await expect(getEditInvestmentDialog(page)).toBeVisible();
}

export async function deleteAllInvestments(page: Page): Promise<void> {
	while (!(await getInvestmentsEmptyState(page).isVisible())) {
		if (!(await getInvestmentExpandedDetails(page).first().isVisible())) {
			await getInvestmentListRows(page).first().click();
		}
		await getInvestmentPurchaseDeleteBtns(page).first().click();
		await page.waitForTimeout(100);
	}
}
