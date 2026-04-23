import { expect, test } from '@playwright/test';
import { setupWorkspaceActivityEmpty, setupWorkspaceActivityWithActions } from '../utils/setup-workspace-activity.util';
import {
	getAuditFilterOption,
	getAuditLogEmptyState,
	getAuditLogExpandedDetails,
	getAuditLogList,
	getAuditLogRowByAction,
	getAuditLogRows,
	getChangeTypeSelect,
	getDateColumnHeader,
	getWorkspaceActivityFilterBadge,
	getWorkspaceActivityFilterBtn,
	getWorkspaceActivityFilterBtnInner,
} from '../locators/workspace-activity-locators';
import data from '../data/workspace-activity.data.json';

// Workspace Activity - Filter button - large screen
test.describe('Workspace Activity - Filter button - large screen', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceActivityEmpty(page, context);
	});

	test('should show filter button with icon and text on large screens', async ({ page }) => {
		await expect(getWorkspaceActivityFilterBtn(page)).toBeVisible();
		await expect(getWorkspaceActivityFilterBtnInner(page)).toContainText('Filter');
	});
});

// Workspace Activity - Filter button - mobile screen
test.describe('Workspace Activity - Filter button - mobile screen', () => {
	test.use({ viewport: { width: 700, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceActivityEmpty(page, context);
	});

	test('should show filter button with icon only on mobile screens', async ({ page }) => {
		await expect(getWorkspaceActivityFilterBtn(page)).toBeVisible();
		await expect(getWorkspaceActivityFilterBtnInner(page)).not.toContainText('Filter');
	});
});

// Workspace Activity - Audit log list - structure
test.describe('Workspace Activity - Audit log list - structure', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceActivityEmpty(page, context);
	});

	test('should show audit log list', async ({ page }) => {
		await expect(getAuditLogList(page)).toBeVisible();
	});

	test('should show empty state on init for new user', async ({ page }) => {
		await expect(getAuditLogEmptyState(page)).toBeVisible();
	});
});

// Workspace Activity - Audit log list - rows
test.describe('Workspace Activity - Audit log list - rows', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceActivityWithActions(page, context);
	});

	test('should show audit log rows after performing actions', async ({ page }) => {
		await expect(getAuditLogRows(page).first()).toBeVisible();
	});
});

// Workspace Activity - Audit log list - expandable rows
test.describe('Workspace Activity - Audit log list - expandable rows', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceActivityWithActions(page, context);
	});

	test('should expand row to show details when clicked', async ({ page }) => {
		await getAuditLogRows(page).first().click();
		await expect(getAuditLogExpandedDetails(page)).toBeVisible();
	});

	test('should show changed values with arrow in expanded detail for Updated rows', async ({ page }) => {
		const updatedRow = getAuditLogRowByAction(page, data.auditLog.updatedLabel);
		await updatedRow.click();
		await expect(getAuditLogExpandedDetails(page)).toBeVisible();
		await expect(getAuditLogExpandedDetails(page)).toContainText(data.changeArrow);
	});

	test('should show the actual updated value in expanded detail for Updated rows', async ({ page }) => {
		const updatedRow = getAuditLogRowByAction(page, data.auditLog.updatedLabel);
		await updatedRow.click();
		await expect(getAuditLogExpandedDetails(page)).toBeVisible();
		await expect(getAuditLogExpandedDetails(page)).toContainText(data.transaction.updatedTitle);
	});
});

// Workspace Activity - Filter - refetch
test.describe('Workspace Activity - Filter - refetch', () => {
	test.use({ viewport: { width: 1400, height: 900 } });

	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceActivityWithActions(page, context);
	});

	test('should refetch audit logs via /api/audit-logs when filter is applied', async ({ page }) => {
		await getWorkspaceActivityFilterBtn(page).click();
		const responsePromise = page.waitForResponse(
			resp => resp.url().includes('/audit-logs') && resp.status() === 200,
		);
		await getChangeTypeSelect(page).click();
		await getAuditFilterOption(page, data.filter.createdLabel).click();
		await responsePromise;
		await expect(getWorkspaceActivityFilterBadge(page)).toBeVisible();
		await expect(getWorkspaceActivityFilterBadge(page)).toContainText(data.filter.filterBadgeCount);
	});
});

// Workspace Activity - Date column visibility
test.describe('Workspace Activity - Date column visibility', () => {
	test.beforeEach(async ({ page, context }) => {
		await setupWorkspaceActivityWithActions(page, context);
	});

	test('should hide Date column below 992px', async ({ page }) => {
		await page.setViewportSize({ width: 800, height: 900 });
		await expect(getDateColumnHeader(page)).not.toBeVisible();
	});

	test('should show Date column at 992px and above', async ({ page }) => {
		await page.setViewportSize({ width: 1400, height: 900 });
		await expect(getDateColumnHeader(page)).toBeVisible();
	});
});
