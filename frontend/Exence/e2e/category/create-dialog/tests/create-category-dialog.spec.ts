import { expect, test } from '@playwright/test';
import { setupTransactions } from '../../../transactions/utils/setup-transactions.utils';
import {
	getCategoriesTabLabel,
	getCategoryListAddBtn,
	getCategoryListRow,
	getCategoryRowInlineActionBtn,
} from '../../../transactions/locators/transactions-locators';
import {
	getCategoryDialogCloseBtn,
	getCategoryNameInput,
	getCategorySubmitBtn,
	getCategoryTypeToggle,
	getCreateCategoryDialog,
	getFirstColorOption,
	getFirstIconOption,
	getIconPickerTrigger,
} from '../../locators/category-dialog-locators';
import { getSnackbar, getSuccessSnackbar } from '../../../snackbar/locators/snackbar-locators';
import { createCategory } from '../../../common/utils/create-category.utils';
import { fillAndBlur, createUniqueName } from '../../../form/utils/form-utils';
import dialogData from '../data/create-category-dialog.data.json';

async function openCreateCategoryDialog(page: Parameters<typeof getCategoryListAddBtn>[0]): Promise<void> {
	await getCategoriesTabLabel(page).click();
	await getCategoryListAddBtn(page).click();
	await expect(getCreateCategoryDialog(page)).toBeVisible();
}

test.describe('Create category dialog — structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openCreateCategoryDialog(page);
	});

	test('should display the create category dialog', async ({ page }) => {
		await expect(getCreateCategoryDialog(page)).toBeVisible();
	});

	test('should display type toggle with three options (EXPENSE, INCOME, MIXED)', async ({ page }) => {
		const toggle = getCategoryTypeToggle(page);
		await expect(toggle.getByText('EXPENSE')).toBeVisible();
		await expect(toggle.getByText('INCOME')).toBeVisible();
		await expect(toggle.getByText('MIXED')).toBeVisible();
	});

	test('EXPENSE is the default selected type', async ({ page }) => {
		const checked = getCategoryTypeToggle(page).locator('mat-button-toggle.mat-button-toggle-checked');
		await expect(checked).toContainText('EXPENSE');
	});

	test('should display the name input field', async ({ page }) => {
		await expect(getCategoryNameInput(page)).toBeVisible();
	});

	test('should display the icon picker trigger', async ({ page }) => {
		await expect(getIconPickerTrigger(page)).toBeVisible();
	});

	test('submit button is disabled when form is invalid', async ({ page }) => {
		await expect(getCreateCategoryDialog(page).getByTestId('btn').last()).toBeDisabled();
	});
});

test.describe('Create category dialog — validators', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openCreateCategoryDialog(page);
	});

	test('name is required — shows error when touched and left empty', async ({ page }) => {
		await getCategoryNameInput(page).click();
		await getCategoryNameInput(page).blur();
		await expect(page.getByText(dialogData.errors.required)).toBeVisible();
	});

	test('name max length is 25 — shows error when 26 chars entered', async ({ page }) => {
		const longName = dialogData.validation.tooLongChar.repeat(dialogData.validation.nameMaxLength + 1);
		await fillAndBlur(getCategoryNameInput(page), longName);
		await expect(page.getByText(dialogData.errors.maxLength25)).toBeVisible();
	});

	test('note max length is 500 — shows error when exceeded', async ({ page }) => {
		const longNote = dialogData.validation.tooLongChar.repeat(dialogData.validation.noteMaxLength + 1);
		const noteInput = getCreateCategoryDialog(page).locator('textarea');
		await fillAndBlur(noteInput, longNote);
		await expect(page.getByText(dialogData.errors.maxLength500)).toBeVisible();
	});

	test('icon is required — submit button disabled without icon selection', async ({ page }) => {
		await fillAndBlur(getCategoryNameInput(page), createUniqueName());
		await expect(getCreateCategoryDialog(page).getByTestId('btn').last()).toBeDisabled();
	});

	test('form is valid and submit enabled after name and icon are provided', async ({ page }) => {
		await fillAndBlur(getCategoryNameInput(page), createUniqueName());
		await getIconPickerTrigger(page).click();
		await getFirstColorOption(page).waitFor({ state: 'visible' });
		await getFirstColorOption(page).click();
		await getFirstIconOption(page).waitFor({ state: 'visible' });
		await getFirstIconOption(page).click();
		await getFirstColorOption(page).waitFor({ state: 'hidden' });
		await expect(getCreateCategoryDialog(page).getByTestId('btn').last()).not.toBeDisabled();
	});
});

test.describe('Create category dialog — type selection', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openCreateCategoryDialog(page);
	});

	test('can switch to INCOME type', async ({ page }) => {
		await getCategoryTypeToggle(page).getByText('INCOME').click();
		const checked = getCategoryTypeToggle(page).locator('mat-button-toggle.mat-button-toggle-checked');
		await expect(checked).toContainText('INCOME');
	});

	test('can switch to MIXED type', async ({ page }) => {
		await getCategoryTypeToggle(page).getByText('MIXED').click();
		const checked = getCategoryTypeToggle(page).locator('mat-button-toggle.mat-button-toggle-checked');
		await expect(checked).toContainText('MIXED');
	});
});

test.describe('Create category dialog — create and cancel', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupTransactions(page, context);
		await openCreateCategoryDialog(page);
	});

	test('cancel button closes the dialog', async ({ page }) => {
		await getCategoryDialogCloseBtn(page).click();
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();
	});

	test('should show success snackbar after creating a category', async ({ page }) => {
		await fillAndBlur(getCategoryNameInput(page), createUniqueName());
		await getIconPickerTrigger(page).click();
		await getFirstColorOption(page).waitFor({ state: 'visible' });
		await getFirstColorOption(page).click();
		await getFirstIconOption(page).waitFor({ state: 'visible' });
		await getFirstIconOption(page).click();
		await getFirstColorOption(page).waitFor({ state: 'hidden' });

		await getCategorySubmitBtn(page).click();
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();
		await expect(getSuccessSnackbar(page)).toBeVisible();
	});

	test('shuold show category name in success snkacbar after creation', async ({ page }) => {
		const name = createUniqueName();
		await createCategory(page, { name });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();
		await expect(getSnackbar(page)).toContainText(`Category '${name}' created successfully!`);
	});

	test('should show success snackbar after category deletion', async ({ page }) => {
		const name = createUniqueName();
		await createCategory(page, { name });
		await expect(getCreateCategoryDialog(page)).not.toBeVisible();

		const categoryRow = getCategoryListRow(page, name);
		await categoryRow.waitFor({ state: 'visible' });
		await getCategoryRowInlineActionBtn(categoryRow).click();

		await expect(getSnackbar(page)).toContainText(dialogData.snackbar.deleteSuccess);
	});
});
