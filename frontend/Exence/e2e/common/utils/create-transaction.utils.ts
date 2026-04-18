import { expect, Page } from '@playwright/test';
import { fillAndBlur } from '../../form/utils/form-utils';
import {
	getFirstMatOption,
	getTransactionAmountInput,
	getTransactionCategorySelect,
	getTransactionCreateBtn,
	getTransactionCreateBtnInner,
	getTransactionRecurringCheckbox,
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
}

export async function createTransaction(page: Page, data: CreateTransactionData): Promise<void> {
	if (data.type) {
		await getTransactionTypeToggle(page).getByText(data.type, { exact: true }).click();
	}

	if (data.recurring) {
		await getTransactionRecurringCheckbox(page).click();
	}

	await fillAndBlur(getTransactionTitleInput(page), data.title);

	const amountInput = getTransactionAmountInput(page);
	await amountInput.clear();
	await fillAndBlur(amountInput, String(data.amount));

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
