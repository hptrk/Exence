import { expect, test } from '@playwright/test';
import { setupCategories } from '../utils/setup-categories.utils';
import {
	getAddCategoryBtn,
	getCategoriesNoCategoriesState,
	getCategoriesNoTransactionsState,
	getCategoryDialogCloseBtn,
	getCategoryItems,
	getCategoryTypeToggle,
	getCategoryTypeToggleChecked,
	getCreateCategoryDialog,
	getCreateFirstCategoryBtn,
	getCreateFirstTransactionBtn,
} from '../locators/categories-locators';
import { createCategory } from '../../../common/utils/create-category.utils';
import { createExpense, createIncome } from '../../../common/utils/create-transaction.utils';
import { getCreateTransactionDialog } from '../../../transaction/locators/transaction-dialog-locators';
import { deleteFirstTransactionInList } from '../../../transaction/utils/transaction-list.utils';
import categoriesData from '../data/categories.data.json';
import { createUniqueName, getCurrentDate } from '../../../form/utils/form-utils';

// Create category

test.describe('Dashboard — categories — create', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupCategories(page, context);
	});

	test('should open create category dialog when no categories exist', async ({ page }) => {
		await getCreateFirstCategoryBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
	});

	test('should close create category dialog on cancel', async ({ page }) => {
		await getCreateFirstCategoryBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await getCategoryDialogCloseBtn(page).click();
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();
	});

	test('should create a category', async ({ page }) => {
		await getCreateFirstCategoryBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name: createUniqueName() });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();
	});
});

// Type filter
test.describe('Dashboard — categories — type filter', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupCategories(page, context);

		// Create an expense category and expense transaction so the two toggle views differ
		const categoryName = createUniqueName();
		await getCreateFirstCategoryBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name: categoryName });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getCreateFirstTransactionBtn(page).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, {
			title: `${categoriesData.transaction.expense.title} ${getCurrentDate()}`,
			amount: categoriesData.transaction.expense.amount,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();
		await expect(getCategoryItems(page).first()).toBeVisible();
	});

	test('should display category type toggle', async ({ page }) => {
		await expect(getCategoryTypeToggle(page)).toBeVisible();
	});

	test('should switch to income category view', async ({ page }) => {
		const expenseItems = await getCategoryItems(page).allTextContents();
		await getCategoryTypeToggle(page).getByText(categoriesData.transactionTypes.income).click();
		await expect(getCategoryTypeToggleChecked(page)).toContainText(categoriesData.transactionTypes.income);
		const incomeItems = await getCategoryItems(page).allTextContents();
		expect(incomeItems).not.toEqual(expenseItems);
	});

	test('should switch back to expense category view', async ({ page }) => {
		await getCategoryTypeToggle(page).getByText(categoriesData.transactionTypes.income).click();
		const incomeItems = await getCategoryItems(page).allTextContents();
		await getCategoryTypeToggle(page).getByText(categoriesData.transactionTypes.expense).click();
		await expect(getCategoryTypeToggleChecked(page)).toContainText(categoriesData.transactionTypes.expense);
		const expenseItems = await getCategoryItems(page).allTextContents();
		expect(expenseItems).not.toEqual(incomeItems);
	});

	test('should display category items when transactions exist', async ({ page }) => {
		const items = getCategoryItems(page);
		const count = await items.count();
		if (count > 0) {
			await expect(items.first()).toBeVisible();
		}
	});
});

// Content states

test.describe('Dashboard — categories — content states', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupCategories(page, context);
	});

	test('should show no-categories state when account is empty', async ({ page }) => {
		await expect(getCategoriesNoCategoriesState(page)).toBeVisible();
		await expect(getCreateFirstCategoryBtn(page)).toBeVisible();
		await expect(getCreateFirstCategoryBtn(page)).toContainText(categoriesData.emptyStates.noCategories.buttonText);
	});

	test('should show no-transactions state when category exists but no transactions', async ({ page }) => {
		await getCreateFirstCategoryBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name: createUniqueName() });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await expect(getCategoriesNoTransactionsState(page)).toBeVisible();
		await expect(getCreateFirstTransactionBtn(page)).toBeVisible();
		await expect(getCreateFirstTransactionBtn(page)).toContainText(
			categoriesData.emptyStates.noTransactions.buttonText,
		);
	});

	test('should show expense category in expense view when expense transaction exists', async ({ page }) => {
		await getCreateFirstCategoryBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name: createUniqueName() });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getCreateFirstTransactionBtn(page).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, {
			title: `${categoriesData.transaction.expense.title} ${getCurrentDate()}`,
			amount: categoriesData.transaction.expense.amount,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		await expect(getCategoryItems(page).first()).toBeVisible();
	});

	test('should show income category in income view when income transaction exists', async ({ page }) => {
		await getCreateFirstCategoryBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, {
			name: createUniqueName(),
			type: 'INCOME',
		});
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getCreateFirstTransactionBtn(page).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createIncome(page, {
			title: `${categoriesData.transaction.income.title} ${getCurrentDate()}`,
			amount: categoriesData.transaction.income.amount,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		await getCategoryTypeToggle(page).getByText(categoriesData.transactionTypes.income).click();
		await expect(getCategoryItems(page).first()).toBeVisible();
	});

	test('should return to no-transactions state after all transactions are deleted', async ({ page }) => {
		await getCreateFirstCategoryBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name: createUniqueName() });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getCreateFirstTransactionBtn(page).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, {
			title: `${categoriesData.transaction.expense.title} ${getCurrentDate()}`,
			amount: categoriesData.transaction.expense.amount,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();
		await expect(getCategoryItems(page).first()).toBeVisible();

		await deleteFirstTransactionInList(page);
		await expect(getCategoriesNoTransactionsState(page)).toBeVisible();
	});

	test('should open create category dialog from add button when transactions exist', async ({ page }) => {
		await getCreateFirstCategoryBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name: createUniqueName() });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getCreateFirstTransactionBtn(page).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, {
			title: `${categoriesData.transaction.expense.title} ${getCurrentDate()}`,
			amount: categoriesData.transaction.expense.amount,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		await getAddCategoryBtn(page).waitFor({ state: 'visible' });
		await getAddCategoryBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
	});
});
