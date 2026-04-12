import { Locator, Page } from '@playwright/test';

export const getSidebar = (page: Page): Locator => page.getByTestId('sidebar');

// Logos
export const getLogoHorizontal = (page: Page): Locator => page.getByTestId('logoHorizontal');
export const getLogoCompact = (page: Page): Locator => page.getByTestId('logoCompact');

// Drawer — unauthenticated nav
export const getNavHomeBtn = (page: Page): Locator => page.getByTestId('navHomeBtn');
export const getNavLoginBtn = (page: Page): Locator => page.getByTestId('navLoginBtn');
export const getNavRegisterBtn = (page: Page): Locator => page.getByTestId('navRegisterBtn');

// Drawer — authenticated nav (admin)
export const getNavAdminBtn = (page: Page): Locator => page.getByTestId('navAdminBtn');

// Drawer — authenticated nav
export const getNavDashboardBtn = (page: Page): Locator => page.getByTestId('navDashboardBtn');
export const getNavTransactionsBtn = (page: Page): Locator => page.getByTestId('navTransactionsBtn');
export const getNavStatisticsBtn = (page: Page): Locator => page.getByTestId('navStatisticsBtn');
export const getNavGoalsBtn = (page: Page): Locator => page.getByTestId('navGoalsBtn');
export const getNavDebtsBtn = (page: Page): Locator => page.getByTestId('navDebtsBtn');

// XL actions
export const getManageAccountsBtn = (page: Page): Locator => page.getByTestId('manageAccountsBtn');
export const getLanguageSelectBtn = (page: Page): Locator => page.getByTestId('languageSelectBtn');
export const getThemeBtn = (page: Page): Locator => page.getByTestId('themeBtn');
export const getLogoutBtn = (page: Page): Locator => page.getByTestId('logoutBtn');

// More-actions button
export const getMoreActionsBtn = (page: Page): Locator => page.getByTestId('moreActionsBtn');

// Mobile navigation
export const getMobileNavigation = (page: Page): Locator => page.getByTestId('mobileNavigation');

// Mobile — unauthenticated nav
export const getMobileNavHomeBtn = (page: Page): Locator => page.getByTestId('mobileNavHomeBtn');
export const getMobileNavLoginBtn = (page: Page): Locator => page.getByTestId('mobileNavLoginBtn');
export const getMobileNavRegisterBtn = (page: Page): Locator => page.getByTestId('mobileNavRegisterBtn');

// Mobile — authenticated nav (admin)
export const getMobileNavAdminBtn = (page: Page): Locator => page.getByTestId('mobileNavAdminBtn');

// Mobile — authenticated nav
export const getMobileNavDashboardBtn = (page: Page): Locator => page.getByTestId('mobileNavDashboardBtn');
export const getMobileNavTransactionsBtn = (page: Page): Locator => page.getByTestId('mobileNavTransactionsBtn');
export const getMobileNavStatisticsBtn = (page: Page): Locator => page.getByTestId('mobileNavStatisticsBtn');
export const getMobileNavGoalsBtn = (page: Page): Locator => page.getByTestId('mobileNavGoalsBtn');
export const getMobileNavDebtsBtn = (page: Page): Locator => page.getByTestId('mobileNavDebtsBtn');

// Mobile more-actions button
export const getMobileMoreActionsBtn = (page: Page): Locator => page.getByTestId('mobileMoreActionsBtn');

// Menu items (shared between drawer and mobile)
export const getAccountSettingsMenuItem = (page: Page): Locator => page.getByTestId('accountSettingsMenuItem');
export const getLanguageMenuItem = (page: Page): Locator => page.getByTestId('languageMenuItem');
export const getThemeMenuItem = (page: Page): Locator => page.getByTestId('themeMenuItem');
export const getLogoutMenuItem = (page: Page): Locator => page.getByTestId('logoutMenuItem');

export const getProfileDialog = (page: Page): Locator => page.getByTestId('profileDialog');
