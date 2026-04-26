import { Locator, Page } from '@playwright/test';

// Open buttons
export const getOpenBtn = (page: Page): Locator => page.getByTestId('manageAccountsBtn');
export const getOpenSidebarMenuBtn = (page: Page): Locator => page.getByTestId('moreActionsBtn');
export const getOpenSidebarMenuBtnSm = (page: Page): Locator => page.getByTestId('mobileMoreActionsBtn');
export const getOpenBtnMobile = (page: Page): Locator => page.getByTestId('accountSettingsMenuItem');

// Dialog
export const getProfileDialog = (page: Page): Locator => page.getByTestId('profileDialog');
export const getProfileUsername = (page: Page): Locator => page.getByTestId('profile-username');
export const getProfileUserPic = (page: Page): Locator => page.getByTestId('profile-user-pic');
export const getProfileWorkspaceName = (page: Page): Locator => page.getByTestId('profile-workspaceName');

// Dialog tabs
export const getProfileTabWorkspaceSettings = (page: Page): Locator =>
	page.getByTestId('profile-tab-workspace-settings');
export const getProfileTabProfileData = (page: Page): Locator => page.getByTestId('profile-tab-profile-data');
export const getProfileUserSettings = (page: Page): Locator => page.getByTestId('profile-tab-user-settings');
export const getProfileSessions = (page: Page): Locator => page.getByTestId('profile-tab-sessions');
export const getProfileActivity = (page: Page): Locator => page.getByTestId('profile-tab-activity');
export const getProfileAchievements = (page: Page): Locator => page.getByTestId('profile-tab-achievements');

// Workspace switch
export const getProfileWorkspaceBtn = (page: Page): Locator => page.getByTestId('profile-workspace-menu-trigger');
export const getProfileWorkspaceMenuTitle = (page: Page): Locator => page.getByTestId('profile-workspace-title');
export const getProfileWorkspaceMenuItems = (page: Page): Locator => page.getByTestId('profile-workspace-menu-item');
