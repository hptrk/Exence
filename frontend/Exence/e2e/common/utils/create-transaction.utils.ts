import { expect, Page } from '@playwright/test';
import { fillAndBlur } from '../../form/utils/form-utils';
import {
	getFirstMatOption,
	getTransactionAmountInput,
	getTransactionCategorySelect,
	getTransactionCreateBtn,
	getTransactionCreateBtnInner,
	getTransactionCurrencyOption,
	getTransactionCurrencySelect,
	getTransactionDateInput,
	getTransactionRecurringCheckbox,
	getTransactionRecurringCheckboxInput,
	getTransactionTitleInput,
	getTransactionTypeToggle,
} from '../../transaction/locators/transaction-dialog-locators';

export type TransactionType = 'EXPENSE' | 'INCOME';

export interface CreateTransactionData {
	title: string;
	amount: number;
	/** Override the type toggle. Omit when the dialog was already opened with the desired type. */
	type?: TransactionType;
	recurring?: boolean;
	/** Select a non-default currency (e.g. 'EUR'). Omit to keep the workspace base currency. */
	currency?: string;
	/** Override the date in MM/dd/yyyy format. Omit to keep today. */
	date?: string;
}

export async function createTransaction(page: Page, data: CreateTransactionData): Promise<void> {
	if (data.type) {
		await getTransactionTypeToggle(page).getByText(data.type, { exact: true }).click();
	}

	if (data.recurring) {
		const isChecked = await getTransactionRecurringCheckboxInput(page).isChecked();
		if (!isChecked) {
			await getTransactionRecurringCheckbox(page).click();
		}
	}

	await fillAndBlur(getTransactionTitleInput(page), data.title);

	const amountInput = getTransactionAmountInput(page);
	await amountInput.clear();
	await fillAndBlur(amountInput, String(data.amount));

	if (data.date) {
		const dateInput = getTransactionDateInput(page);
		await dateInput.clear();
		await fillAndBlur(dateInput, data.date);
	}

	if (data.currency) {
		await getTransactionCurrencySelect(page).click();
		await getTransactionCurrencyOption(page, data.currency).waitFor({ state: 'visible' });
		await getTransactionCurrencyOption(page, data.currency).click();
	}

	await getTransactionCategorySelect(page).click();
	await getFirstMatOption(page).waitFor({ state: 'visible' });
	await getFirstMatOption(page).click();

	const createBtn = getTransactionCreateBtn(page);
	await createBtn.waitFor({ state: 'visible' });
	await expect(getTransactionCreateBtnInner(page)).not.toBeDisabled();
	await createBtn.click();
}

export async function createExpense(page: Page, data: Omit<CreateTransactionData, 'type'>): Promise<void> {
	return createTransaction(page, { ...data, type: 'EXPENSE' });
}

export async function createIncome(page: Page, data: Omit<CreateTransactionData, 'type'>): Promise<void> {
	return createTransaction(page, { ...data, type: 'INCOME' });
}

export async function createRecurringExpense(
	page: Page,
	data: Omit<CreateTransactionData, 'type' | 'recurring'>,
): Promise<void> {
	return createTransaction(page, { ...data, type: 'EXPENSE', recurring: true });
}

export async function createRecurringIncome(
	page: Page,
	data: Omit<CreateTransactionData, 'type' | 'recurring'>,
): Promise<void> {
	return createTransaction(page, { ...data, type: 'INCOME', recurring: true });
}
