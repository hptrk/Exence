import { expect, Page } from '@playwright/test';
import { SupportedCurrency } from '../../../../src/app/data-model/modules/user-settings/SupportedCurrency';
import { createUniqueName, fillAndBlur } from '../../../form/utils/form-utils';
import { getProfileTabWorkspaceSettings } from '../../locators/profile-dialog-locators';
import {
	getAddMemberAddBtn,
	getAddMemberDialog,
	getAddMemberEmailInput,
	getAddWorkspaceCreateBtn,
	getAddWorkspaceCurrencyInput,
	getAddWorkspaceCurrencyOptions,
	getAddWorkspaceDialog,
	getAddWorkspaceNameInput,
	getWorkspaceAddBtn,
	getWorkspaceAddMember,
	getWorkspaceRows,
} from '../locators/workspaces-locators';

interface CreateWorkspaceData {
	name: string;
	baseCurrency: SupportedCurrency;
}

export async function createWorkspace(page: Page, data?: Partial<CreateWorkspaceData>): Promise<void> {
	await getWorkspaceAddBtn(page).click();
	await page.waitForTimeout(250);
	await expect(getAddWorkspaceDialog(page)).toBeVisible();
	await fillAndBlur(getAddWorkspaceNameInput(page), data?.name ?? createUniqueName());
	await getAddWorkspaceCurrencyInput(page).click();
	await getAddWorkspaceCurrencyOptions(page)
		.filter({ hasText: data?.baseCurrency ?? 'HUF' })
		.click();
	await getAddWorkspaceCreateBtn(page).click();
	await expect(getAddWorkspaceDialog(page)).not.toBeVisible();
}

export async function inviteUserToWorkspace(page: Page, email: string, workspaceName: string): Promise<void> {
	await getProfileTabWorkspaceSettings(page).click();
	await getWorkspaceRows(page).filter({ hasText: workspaceName }).scrollIntoViewIfNeeded();
	const row = getWorkspaceRows(page).filter({ hasText: workspaceName });
	row.click();
	await getWorkspaceAddMember(row).click();
	await fillAndBlur(getAddMemberEmailInput(page), email);
	await getAddMemberAddBtn(page).click();
	await expect(getAddMemberDialog(page)).not.toBeVisible();
}
