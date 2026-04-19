import { expect, Page } from '@playwright/test';
import { fillAndBlur } from '../../../form/utils/form-utils';
import {
	getFirstMatOption,
	getTransactionAmountInput,
	getTransactionCategorySelect,
	getTransactionTitleInput,
} from '../../locators/transaction-dialog-locators';
import { getExchangeRateInput } from '../locators/create-transaction-dialog-locators';
import data from '../data/create-transaction-dialog.data.json';

export function formatTitle(title: string): string {
	const suffix = title.length > 10 ? '...' : '';
	return `${title.slice(0, 10)}${suffix}`;
}

export async function fillValidForm(page: Page, title: string): Promise<void> {
	await fillAndBlur(getTransactionTitleInput(page), title);
	const amountInput = getTransactionAmountInput(page);
	await amountInput.clear();
	await fillAndBlur(amountInput, String(data.amount));
	// Wait for exchange rate auto-fetch before selecting category
	await expect(getExchangeRateInput(page)).not.toBeDisabled();
	await getTransactionCategorySelect(page).click();
	await getFirstMatOption(page).waitFor({ state: 'visible' });
	await getFirstMatOption(page).click();
}
