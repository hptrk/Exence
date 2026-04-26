import { expect, test } from '@playwright/test';
import { getCreateCategoryDialog } from '../../category/locators/category-dialog-locators';
import { getOverlayBackdrop } from '../../common/locators/overlay.locators';
import { createCategory } from '../../common/utils/create-category.utils';
import { createExpense, createIncome, createTransaction } from '../../common/utils/create-transaction.utils';
import {
	createUniqueName,
	formatDateForInput,
	formatDateForList,
	getCurrentDate,
	getDateDaysAgo,
} from '../../form/utils/form-utils';
import {
	getEditTitleInput,
	getEditTransactionDialog,
} from '../../transaction/edit-transaction-dialog/locators/edit-transaction-dialog-locators';
import {
	getCreateTransactionDialog,
	getRecurringConfig,
	getTransactionCategoryOption,
	getTransactionCategorySelect,
	getTransactionTypeToggle,
	getTransactionTypeToggleChecked,
} from '../../transaction/locators/transaction-dialog-locators';
import {
	getListAddBtn,
	getListDataRow,
	getListDataRowMenuTriggerBtn,
	getListEmptyState,
	getRowActionDelete,
	getRowActionDuplicate,
	getRowActionEdit,
} from '../../transaction/locators/transaction-list-locators';
import { setShowBaseCurrency } from '../../workspace-settings/utils/workspace-settings.utils';
import transactionsData from '../data/transactions.data.json';
import {
	getActiveTab,
	getCategoriesTabIcon,
	getCategoriesTabLabel,
	getCategoriesTabText,
	getCategoryListAddBtn,
	getCategoryListAmountSpan,
	getCategoryListEmptyState,
	getCategoryListRow,
	getCategoryRowIcon,
	getCategoryRowIconContainer,
	getCategoryRowInlineActionBtn,
	getConfirmDialog,
	getConfirmDialogActionBtn,
	getFilterBadge,
	getFilterMenuBtn,
	getFilterMenuBtnBtn,
	getFilterMenuBtnCollapsed,
	getFilterTypeSelect,
	getPageTitle,
	getRecurringExpensesList,
	getRecurringFilterCheckbox,
	getRecurringIncomesList,
	getRecurringTransactionsList,
	getSearchTextInput,
	getTabs,
	getTransactionList,
	getTransactionMenuTrigger,
	getTransactionRow,
	getTransactionRows,
	getTransactionsTabIcon,
	getTransactionsTabLabel,
	getTransactionsTabText,
} from '../locators/transactions-locators';
import {
	createDefaultCategoryOnTransactionsPage as createDefaultCategory,
	setupTransactions,
} from '../utils/setup-transactions.utils';

// Layout
test.describe('Transactions page - layout', () => {
	test.describe('on large screens', () => {
		test.use({ viewport: { width: 1400, height: 900 } });

		test.beforeEach(async ({ page, context }) => {
			await setupTransactions(page, context);
		});

		test('should display separate recurring expense and income lists', async ({ page }) => {
			await expect(getRecurringExpensesList(page)).toBeVisible();
			await expect(getRecurringIncomesList(page)).toBeVisible();
			await expect(getRecurringTransactionsList(page)).not.toBeVisible();
		});

		test('should display the main transaction list', async ({ page }) => {
			await expect(getTransactionList(page)).toBeVisible();
		});

		test('should display filter menu button with icon and text', async ({ page }) => {
			await expect(getFilterMenuBtnBtn(page)).toBeVisible();
			await expect(getFilterMenuBtnCollapsed(page)).not.toBeVisible();
		});

		test('should display search text input', async ({ page }) => {
			await expect(getSearchTextInput(page)).toBeVisible();
		});

		test('should display tab labels with icon and text', async ({ page }) => {
			await expect(getTransactionsTabIcon(page)).toBeVisible();
			await expect(getTransactionsTabText(page)).toBeVisible();
			await expect(getCategoriesTabIcon(page)).toBeVisible();
			await expect(getCategoriesTabText(page)).toBeVisible();
		});
	});

	test.describe('on mobile screens', () => {
		test.use({ viewport: { width: 600, height: 900 } });

		test.beforeEach(async ({ page, context }) => {
			await setupTransactions(page, context);
		});

		test('should display a single combined recurring list', async ({ page }) => {
			await expect(getRecurringTransactionsList(page)).toBeVisible();
			await expect(getRecurringExpensesList(page)).not.toBeVisible();
			await expect(getRecurringIncomesList(page)).not.toBeVisible();
		});

		test('should display the main transaction list', async ({ page }) => {
			await expect(getTransactionList(page)).toBeVisible();
		});

		test('should collapse filter menu button to icon only', async ({ page }) => {
			await expect(getFilterMenuBtnCollapsed(page)).toBeVisible();
		});

		test('should display search text input', async ({ page }) => {
			await expect(getSearchTextInput(page)).toBeVisible();
		});

		test('should display tab labels with icon only', async ({ page }) => {
			await expect(getTransactionsTabIcon(page)).toBeVisible();
			await expect(getTransactionsTabText(page)).not.toBeVisible();
			await expect(getCategoriesTabIcon(page)).toBeVisible();
			await expect(getCategoriesTabText(page)).not.toBeVisible();
		});
	});
});

// Tabs
test.describe('Transactions page - tabs', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
	});

	test('should have Transactions tab active by default', async ({ page }) => {
		await expect(getActiveTab(page)).toContainText('Transactions');
		await expect(getPageTitle(page)).toContainText(transactionsData.title.transactions);
	});

	test('should display two tabs in the tab group', async ({ page }) => {
		await expect(getTabs(page)).toHaveCount(2);
		await expect(getTransactionsTabLabel(page)).toContainText(transactionsData.title.transactions);
		await expect(getCategoriesTabLabel(page)).toContainText(transactionsData.title.categories);
	});

	test('should switching to categories tab update page title to Categories', async ({ page }) => {
		await getCategoriesTabLabel(page).click();
		await expect(getPageTitle(page)).toContainText(transactionsData.title.categories);
	});

	test('should switching back to transactions tab show Transactions title', async ({ page }) => {
		await getCategoriesTabLabel(page).click();
		await getTransactionsTabLabel(page).click();
		await expect(getPageTitle(page)).toContainText(transactionsData.title.transactions);
	});
});

// Filter
test.describe('Transactions page - filter', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
	});

	test('should display filter menu button', async ({ page }) => {
		await expect(getFilterMenuBtn(page)).toBeVisible();
	});

	test('should display search text input', async ({ page }) => {
		await expect(getSearchTextInput(page)).toBeVisible();
	});

	test('should show filter badge when type filter is applied', async ({ page }) => {
		await getFilterMenuBtn(page).click();
		await getFilterTypeSelect(page).click();
		await page.getByRole('option', { name: transactionsData.filter.labels.expense, exact: true }).click();
		await expect(getFilterBadge(page)).toBeVisible();
		await expect(getFilterBadge(page)).toContainText(transactionsData.filter.badgeCount);
	});

	test('filtering by EXPENSE shows only expense transactions', async ({ page }) => {
		await createDefaultCategory(page);
		const expenseTitle = `${transactionsData.transaction.expenseUnique.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, {
			title: expenseTitle,
			amount: transactionsData.transaction.expenseUnique.amount,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		await getFilterMenuBtn(page).click();
		await getFilterTypeSelect(page).click();
		await page.getByRole('option', { name: transactionsData.filter.labels.expense, exact: true }).click();
		await page.keyboard.press('Escape');

		await expect(getTransactionRow(page, expenseTitle)).toBeVisible();
	});

	test('filtering by INCOME shows only income transactions', async ({ page }) => {
		await createDefaultCategory(page, 'INCOME');
		const incomeTitle = `${transactionsData.transaction.incomeUnique.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createIncome(page, {
			title: incomeTitle,
			amount: transactionsData.transaction.incomeUnique.amount,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		await getFilterMenuBtn(page).click();
		await getFilterTypeSelect(page).click();
		await page.getByRole('option', { name: transactionsData.filter.labels.income, exact: true }).click();
		await page.keyboard.press('Escape');

		await expect(getTransactionRow(page, incomeTitle)).toBeVisible();
	});

	test('filtering by recurring hides non-recurring transactions', async ({ page }) => {
		await createDefaultCategory(page);
		const expenseTitle = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, {
			title: expenseTitle,
			amount: transactionsData.transaction.expense.amount,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();
		await expect(getTransactionRow(page, expenseTitle)).toBeVisible();

		await getFilterMenuBtn(page).click();
		await getRecurringFilterCheckbox(page).check();
		await page.keyboard.press('Escape');

		await expect(getTransactionRow(page, expenseTitle)).not.toBeVisible();
	});
});

// Recurring list - dialog type and recurring checkbox prefill
test.describe('Transactions page - recurring list dialog prefill', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
	});

	test('should select EXPENSE type and recurring when opening dialog from recurring expenses list', async ({
		page,
	}) => {
		await getListAddBtn(getRecurringExpensesList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await expect(getTransactionTypeToggleChecked(page)).toContainText('EXPENSE');
		await expect(getRecurringConfig(page)).toBeVisible();
	});

	test('should select INCOME type and recurring when opening dialog from recurring incomes list', async ({
		page,
	}) => {
		await getListAddBtn(getRecurringIncomesList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await expect(getTransactionTypeToggleChecked(page)).toContainText('INCOME');
		await expect(getRecurringConfig(page)).toBeVisible();
	});

	test('should recurring checkbox be selected when opening dialog from mobile combined recurring list', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 900, height: 800 });
		await getListAddBtn(getRecurringTransactionsList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await expect(getRecurringConfig(page)).toBeVisible();
	});
});

// Recurring list - create and display with expanded details
test.describe('Transactions page - recurring list create', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
	});

	test('should creating a recurring expense show it in the recurring expenses list', async ({ page }) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.recurring.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getRecurringExpensesList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createTransaction(page, {
			title,
			amount: transactionsData.recurring.expense.amount,
			type: 'EXPENSE',
			recurring: true,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();
		await expect(getListDataRow(getRecurringExpensesList(page), title)).toBeVisible();
	});

	test('should creating a recurring income show it in the recurring incomes list', async ({ page }) => {
		await createDefaultCategory(page, 'INCOME');
		const title = `${transactionsData.recurring.income.title} ${getCurrentDate()}`;
		await getListAddBtn(getRecurringIncomesList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createTransaction(page, {
			title,
			amount: transactionsData.recurring.income.amount,
			type: 'INCOME',
			recurring: true,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();
		await expect(getListDataRow(getRecurringIncomesList(page), title)).toBeVisible();
	});

	test('should recurring expense row be expandable and expanded details show are correctly', async ({ page }) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.recurring.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getRecurringExpensesList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createTransaction(page, {
			title,
			amount: transactionsData.recurring.expense.amount,
			type: 'EXPENSE',
			recurring: true,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getListDataRow(getRecurringExpensesList(page), title);
		await row.waitFor({ state: 'visible' });
		await row.click();

		const list = getRecurringExpensesList(page);
		await expect(list.getByText(transactionsData.expandedDetails.noteLabel)).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.frequencyLabel)).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.nextExecutionLabel)).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.occurrenceLabel)).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.endsLabel)).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.endsNever)).toBeVisible();
	});

	test('should recurring income row be expandable and expanded details show are correctly', async ({ page }) => {
		await createDefaultCategory(page, 'INCOME');
		const title = `${transactionsData.recurring.income.title} ${getCurrentDate()}`;
		await getListAddBtn(getRecurringIncomesList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createTransaction(page, {
			title,
			amount: transactionsData.recurring.income.amount,
			type: 'INCOME',
			recurring: true,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getListDataRow(getRecurringIncomesList(page), title);
		await row.waitFor({ state: 'visible' });
		await row.click();

		const list = getRecurringIncomesList(page);
		await expect(list.getByText(transactionsData.expandedDetails.frequencyLabel)).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.nextExecutionLabel)).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.endsNever)).toBeVisible();
	});

	test('should show empty list illustration when deleting the last recurring expense', async ({ page }) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.recurring.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getRecurringExpensesList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createTransaction(page, {
			title,
			amount: transactionsData.recurring.expense.amount,
			type: 'EXPENSE',
			recurring: true,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getListDataRow(getRecurringExpensesList(page), title);
		await row.waitFor({ state: 'visible' });
		await row.click();
		await getListDataRowMenuTriggerBtn(row).waitFor({ state: 'visible' });
		await getListDataRowMenuTriggerBtn(row).click();
		await getRowActionDelete(page).click();

		await expect(getListEmptyState(getRecurringExpensesList(page))).toBeVisible();
	});

	test('should show empty list illustration when deleting last recurring income', async ({ page }) => {
		await createDefaultCategory(page, 'INCOME');
		const title = `${transactionsData.recurring.income.title} ${getCurrentDate()}`;
		await getListAddBtn(getRecurringIncomesList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createTransaction(page, {
			title,
			amount: transactionsData.recurring.income.amount,
			type: 'INCOME',
			recurring: true,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getListDataRow(getRecurringIncomesList(page), title);
		await row.waitFor({ state: 'visible' });
		await row.click();
		await getListDataRowMenuTriggerBtn(row).waitFor({ state: 'visible' });
		await getListDataRowMenuTriggerBtn(row).click();
		await getRowActionDelete(page).click();

		await expect(getListEmptyState(getRecurringIncomesList(page))).toBeVisible();
	});
});

// Transaction list - rows and expand
test.describe('Transactions page - transaction list rows', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
	});

	test('should transaction row be expandable details contain note, created-at and recurring status', async ({
		page,
	}) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, { title, amount: transactionsData.transaction.expense.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getTransactionRow(page, title);
		await row.waitFor({ state: 'visible' });
		await row.click();

		const list = getTransactionList(page);
		await expect(list.getByText(transactionsData.expandedDetails.noteLabel)).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.createdAtLabel)).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.recurringLabel)).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.recurringNo, { exact: true })).toBeVisible();
	});

	test('should non base currency logged transaction expanded detail show base currency amount when showBaseCurrency is off', async ({
		page,
	}) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, {
			title,
			amount: transactionsData.transaction.expense.amount,
			currency: transactionsData.foreignCurrency,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getTransactionRow(page, title);
		await row.waitFor({ state: 'visible' });
		await row.click();

		const list = getTransactionList(page);
		await expect(list.getByText(transactionsData.expandedDetails.baseCurrencyLabel, { exact: true })).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.amountBaseLabel, { exact: true })).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.exchangeRateLabel, { exact: true })).toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.loggedCurrencyLabel, { exact: true }),
		).not.toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.amountLoggedLabel, { exact: true }),
		).not.toBeVisible();
	});

	test('should non base currency logged transaction expanded detail show logged currency amount when showBaseCurrency is on', async ({
		page,
	}) => {
		await setShowBaseCurrency(page, true);
		await createDefaultCategory(page);
		const title = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, {
			title,
			amount: transactionsData.transaction.expense.amount,
			currency: transactionsData.foreignCurrency,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getTransactionRow(page, title);
		await row.waitFor({ state: 'visible' });
		await row.click();

		const list = getTransactionList(page);
		await expect(
			list.getByText(transactionsData.expandedDetails.loggedCurrencyLabel, { exact: true }),
		).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.amountLoggedLabel, { exact: true })).toBeVisible();
		await expect(list.getByText(transactionsData.expandedDetails.exchangeRateLabel, { exact: true })).toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.baseCurrencyLabel, { exact: true }),
		).not.toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.amountBaseLabel, { exact: true }),
		).not.toBeVisible();
	});

	test('should base currency logged transaction expanded detail not show currency section when showBaseCurrency is off', async ({
		page,
	}) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, { title, amount: transactionsData.transaction.expense.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getTransactionRow(page, title);
		await row.waitFor({ state: 'visible' });
		await row.click();

		const list = getTransactionList(page);
		await expect(
			list.getByText(transactionsData.expandedDetails.baseCurrencyLabel, { exact: true }),
		).not.toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.amountBaseLabel, { exact: true }),
		).not.toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.exchangeRateLabel, { exact: true }),
		).not.toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.loggedCurrencyLabel, { exact: true }),
		).not.toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.amountLoggedLabel, { exact: true }),
		).not.toBeVisible();
	});

	test('should base currency logged transaction expanded detail not show currency section when showBaseCurrency is on', async ({
		page,
	}) => {
		await setShowBaseCurrency(page, true);
		await createDefaultCategory(page);
		const title = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, { title, amount: transactionsData.transaction.expense.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getTransactionRow(page, title);
		await row.waitFor({ state: 'visible' });
		await row.click();

		const list = getTransactionList(page);
		await expect(
			list.getByText(transactionsData.expandedDetails.baseCurrencyLabel, { exact: true }),
		).not.toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.amountBaseLabel, { exact: true }),
		).not.toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.exchangeRateLabel, { exact: true }),
		).not.toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.loggedCurrencyLabel, { exact: true }),
		).not.toBeVisible();
		await expect(
			list.getByText(transactionsData.expandedDetails.amountLoggedLabel, { exact: true }),
		).not.toBeVisible();
	});
});

// Transaction actions - delete
test.describe('Transactions page - delete transaction', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
	});

	test('should remove transaction from list and show empty illustration after deleting the last transaction', async ({
		page,
	}) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, { title, amount: transactionsData.transaction.expense.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getTransactionRow(page, title);
		await row.waitFor({ state: 'visible' });
		await row.click();
		await getTransactionMenuTrigger(page).waitFor({ state: 'visible' });
		await getTransactionMenuTrigger(page).click();
		await getRowActionDelete(page).click();

		await expect(getTransactionRow(page, title)).not.toBeVisible();
		await expect(getListEmptyState(getTransactionList(page))).toBeVisible();
	});
});

// Transaction actions - duplicate
test.describe('Transactions page - duplicate transaction', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
	});

	test('should open confirm dialog after clicking duplicate button', async ({ page }) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, { title, amount: transactionsData.transaction.expense.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getTransactionRow(page, title);
		await row.waitFor({ state: 'visible' });
		await row.click();
		await getTransactionMenuTrigger(page).waitFor({ state: 'visible' });
		await getTransactionMenuTrigger(page).click();
		await getRowActionDuplicate(page).click();

		await expect(getConfirmDialog(page)).toBeVisible();
		await expect(getConfirmDialog(page)).toContainText(title);
	});

	test('should cancelling duplicate confirmation keep the list unchanged', async ({ page }) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, { title, amount: transactionsData.transaction.expense.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getTransactionRow(page, title);
		await row.waitFor({ state: 'visible' });
		await row.click();
		await getTransactionMenuTrigger(page).waitFor({ state: 'visible' });
		await getTransactionMenuTrigger(page).click();
		await getRowActionDuplicate(page).click();

		await getConfirmDialogActionBtn(page, 'Cancel').click();
		await expect(getConfirmDialog(page)).not.toBeVisible();
		await expect(getTransactionRows(page).filter({ hasText: title })).toHaveCount(1);
	});

	test('should create transaction with same data but date changed to current when clicking duplicate button', async ({
		page,
	}) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		const pastDate = getDateDaysAgo(2);

		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, {
			title,
			amount: transactionsData.transaction.expense.amount,
			date: formatDateForInput(pastDate),
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getTransactionRow(page, title);
		await row.waitFor({ state: 'visible' });
		await row.click();
		await getTransactionMenuTrigger(page).waitFor({ state: 'visible' });
		await getTransactionMenuTrigger(page).click();
		await getRowActionDuplicate(page).click();

		await getConfirmDialogActionBtn(page, 'Duplicate').click();
		await expect(getConfirmDialog(page)).not.toBeVisible();

		const allRows = getTransactionRows(page).filter({ hasText: title });
		await expect(allRows).toHaveCount(2);

		const originalRow = allRows.filter({ hasText: formatDateForList(pastDate) });
		const duplicateRow = allRows.filter({ hasText: formatDateForList(new Date()) });
		await expect(originalRow).toHaveCount(1);
		await expect(duplicateRow).toHaveCount(1);

		const originalAmount = await originalRow.locator('span.fw-semibold').textContent();
		await expect(duplicateRow.locator('span.fw-semibold')).toHaveText(originalAmount!.trim());

		const originalCategoryIcon = await originalRow.locator('.icon-container mat-icon').textContent();
		await expect(duplicateRow.locator('.icon-container mat-icon')).toHaveText(originalCategoryIcon!.trim());
	});
});

// Transaction actions - edit
test.describe('Transactions page - edit transaction', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
	});

	test("should edit transaction dialog be prefilled with the transaction' data", async ({ page }) => {
		await createDefaultCategory(page);
		const title = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, { title, amount: transactionsData.transaction.expense.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const row = getTransactionRow(page, title);
		await row.waitFor({ state: 'visible' });
		await row.click();
		await getTransactionMenuTrigger(page).waitFor({ state: 'visible' });
		await getTransactionMenuTrigger(page).click();
		await getRowActionEdit(page).click();

		await expect(getEditTransactionDialog(page)).toBeVisible();
		await expect(getEditTitleInput(page)).toHaveValue(title);
	});
});

// Categories tab - empty state
test.describe('Transactions page - categories tab empty state', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await getCategoriesTabLabel(page).click();
	});

	test('should show empty state image when no categories exist', async ({ page }) => {
		await expect(getCategoryListEmptyState(page)).toBeVisible();
	});

	test('should open create category dialog when clicking the add button', async ({ page }) => {
		await getCategoryListAddBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
	});
});

// Categories tab - create and delete
test.describe('Transactions page - categories tab create and delete', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await getCategoriesTabLabel(page).click();
	});

	test('should show category in list with selected icon, color, name and amount 0', async ({ page }) => {
		const name = createUniqueName();
		await getCategoryListAddBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		const { color: selectedColor } = await createCategory(page, { name });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		const categoryRow = getCategoryListRow(page, name);
		await expect(categoryRow).toBeVisible();
		await expect(categoryRow).toContainText(name);
		await expect(getCategoryRowIcon(categoryRow)).toBeVisible();
		await expect(getCategoryRowIcon(categoryRow)).not.toBeEmpty();
		const iconColor = await getCategoryRowIconContainer(categoryRow).evaluate((el: HTMLElement) =>
			el.style.getPropertyValue('--icon-color').trim(),
		);
		expect(iconColor).toBe(selectedColor);
		await expect(getCategoryListAmountSpan(categoryRow)).toContainText('0');
	});

	test('should deleting a category remove it from the list and show empty list illustration', async ({ page }) => {
		const name = createUniqueName();
		await getCategoryListAddBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		const categoryRow = getCategoryListRow(page, name);
		await categoryRow.waitFor({ state: 'visible' });
		await getCategoryRowInlineActionBtn(categoryRow).click();

		await expect(getCategoryListRow(page, name)).not.toBeVisible();
		await expect(getCategoryListEmptyState(page)).toBeVisible();
	});
});

// Categories tab - balance and color classes
test.describe('Transactions page - categories tab balance and color', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
	});

	test('should EXPENSE category amount has expense CSS class after an expense transaction', async ({ page }) => {
		await getCategoriesTabLabel(page).click();
		const name = createUniqueName();
		await getCategoryListAddBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name, type: 'EXPENSE' });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getTransactionsTabLabel(page).click();
		const expenseTitle = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, { title: expenseTitle, amount: transactionsData.transaction.expense.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		await getCategoriesTabLabel(page).click();
		const row = getCategoryListRow(page, name);
		await row.waitFor({ state: 'visible' });
		await expect(getCategoryListAmountSpan(row)).toHaveClass(/expense/);
	});

	test('should INCOME category amount has income CSS class after an income transaction', async ({ page }) => {
		await getCategoriesTabLabel(page).click();
		const name = createUniqueName();
		await getCategoryListAddBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name, type: 'INCOME' });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getTransactionsTabLabel(page).click();
		const incomeTitle = `${transactionsData.transaction.income.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createIncome(page, { title: incomeTitle, amount: transactionsData.transaction.income.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		await getCategoriesTabLabel(page).click();
		const row = getCategoryListRow(page, name);
		await row.waitFor({ state: 'visible' });
		await expect(getCategoryListAmountSpan(row)).toHaveClass(/income/);
	});

	test('should MIXED category shows expense class when expense exceeds income', async ({ page }) => {
		await getCategoriesTabLabel(page).click();
		const name = createUniqueName();
		await getCategoryListAddBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name, type: 'MIXED' });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getTransactionsTabLabel(page).click();
		const expenseTitle = `${transactionsData.transaction.income.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, {
			title: expenseTitle,
			amount: transactionsData.transaction.income.amount,
		});
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		await getCategoriesTabLabel(page).click();
		const row = getCategoryListRow(page, name);
		await row.waitFor({ state: 'visible' });
		await expect(getCategoryListAmountSpan(row)).toHaveClass(/expense/);
	});

	test('should MIXED category shows income class when income exceeds expenses', async ({ page }) => {
		await getCategoriesTabLabel(page).click();
		const name = createUniqueName();
		await getCategoryListAddBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name, type: 'MIXED' });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getTransactionsTabLabel(page).click();
		const expenseTitle = `${transactionsData.transaction.expense.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createExpense(page, { title: expenseTitle, amount: transactionsData.transaction.expense.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		const incomeTitle = `${transactionsData.transaction.income.title} ${getCurrentDate()}`;
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();
		await createIncome(page, { title: incomeTitle, amount: transactionsData.transaction.income.amount });
		await expect(getCreateTransactionDialog(page)).not.toBeVisible();

		await getCategoriesTabLabel(page).click();
		const row = getCategoryListRow(page, name);
		await row.waitFor({ state: 'visible' });
		await expect(getCategoryListAmountSpan(row)).toHaveClass(/income/);
	});
});

// Categories tab - category type filtering in transaction dialog
test.describe('Transactions page - category type filtering in transaction dialog', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await getCategoriesTabLabel(page).click();
	});

	test('income category should only appear as option when creating income transaction', async ({ page }) => {
		const name = createUniqueName();
		await getCategoryListAddBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name, type: 'INCOME' });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getTransactionsTabLabel(page).click();
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();

		await getTransactionTypeToggle(page).getByText('EXPENSE', { exact: true }).click();
		await getTransactionCategorySelect(page).click();
		await expect(getTransactionCategoryOption(page, name)).not.toBeVisible();

		// clicking the type toggle is outside the overlay panel - closes the dropdown and switches type
		await getTransactionTypeToggle(page).getByText('INCOME', { exact: true }).click();
		await getTransactionCategorySelect(page).click();
		await expect(getTransactionCategoryOption(page, name)).toBeVisible();
	});

	test('expense category should only appear as option when creating expense transaction', async ({ page }) => {
		const name = createUniqueName();
		await getCategoryListAddBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name, type: 'EXPENSE' });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getTransactionsTabLabel(page).click();
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();

		await getTransactionTypeToggle(page).getByText('INCOME', { exact: true }).click();
		await getTransactionCategorySelect(page).click();
		await expect(getTransactionCategoryOption(page, name)).not.toBeVisible();

		await getTransactionTypeToggle(page).getByText('EXPENSE', { exact: true }).click();
		await getTransactionCategorySelect(page).click();
		await expect(getTransactionCategoryOption(page, name)).toBeVisible();
	});

	test('mixed category should appear as option when creating both income and expense transactions', async ({
		page,
	}) => {
		const name = createUniqueName();
		await getCategoryListAddBtn(page).click();
		await expect(getCreateCategoryDialog(page)).toBeVisible();
		await createCategory(page, { name, type: 'MIXED' });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		await getTransactionsTabLabel(page).click();
		await getListAddBtn(getTransactionList(page)).click();
		await expect(getCreateTransactionDialog(page)).toBeVisible();

		await getTransactionTypeToggle(page).getByText('EXPENSE', { exact: true }).click();
		await getTransactionCategorySelect(page).click();
		await expect(getTransactionCategoryOption(page, name)).toBeVisible();
		await getOverlayBackdrop(page).click();

		await getTransactionTypeToggle(page).getByText('INCOME', { exact: true }).click();
		await getTransactionCategorySelect(page).click();
		await expect(getTransactionCategoryOption(page, name)).toBeVisible();
	});
});
