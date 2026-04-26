import { expect, Page } from '@playwright/test';
import { getManageAccountsBtn, getProfileDialog } from '../../sidebar/locators/sidebar-locators';
import { getSuccessSnackbar } from '../../snackbar/locators/snackbar-locators';
import {
	getProfileDialogCloseBtn,
	getShowBaseCurrencyCheckbox,
	getShowBaseCurrencyCheckboxInput,
	getWorkspaceSettingsSaveBtn,
	getWorkspaceSettingsSaveBtnInner,
} from '../locators/workspace-settings-locators';

export async function setShowBaseCurrency(page: Page, show: boolean): Promise<void> {
	await getManageAccountsBtn(page).click();
	await expect(getProfileDialog(page)).toBeVisible();
	await getShowBaseCurrencyCheckboxInput(page).waitFor({ state: 'visible' });
	const isChecked = await getShowBaseCurrencyCheckboxInput(page).isChecked();
	if (isChecked !== show) {
		await getShowBaseCurrencyCheckbox(page).click();
		await expect(getWorkspaceSettingsSaveBtnInner(page)).not.toBeDisabled();
		await getWorkspaceSettingsSaveBtn(page).click();
		await expect(getSuccessSnackbar(page)).toBeVisible();
	}
	await getProfileDialogCloseBtn(page).click();
	await expect(getProfileDialog(page)).not.toBeVisible();
}
