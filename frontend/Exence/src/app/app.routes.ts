import { Routes } from '@angular/router';

import { DashboardComponent } from './private/dashboard/dashboard.component';
import { DebtsComponent } from './private/debts/debts.component';
import { GoalsComponent } from './private/goals/goals.component';
import { ProfileComponent } from './private/profile/profile.component';
import { SettingsComponent } from './private/settings/settings.component';
import { StatisticsComponent } from './private/statistics/statistics.component';
import { TransactionsComponent } from './private/transactions/transactions.component';
import { publicRoutes } from './public/public.routes';
import { loggedInGuard } from './shared/auth/guard/logged-in.guard';

export const routes: Routes = [
	...publicRoutes,
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full',
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [loggedInGuard],
	},
	{
		path: 'goals',
		component: GoalsComponent,
		canActivate: [loggedInGuard],
	},
	{
		path: 'statistics',
		component: StatisticsComponent,
		canActivate: [loggedInGuard],
	},
	{
		path: 'transactions',
		component: TransactionsComponent,
		canActivate: [loggedInGuard],
	},
	{
		path: 'debts',
		component: DebtsComponent,
		canActivate: [loggedInGuard],
	},
	{
		path: 'profile',
		component: ProfileComponent,
		canActivate: [loggedInGuard],
	},
	{
		path: 'settings',
		component: SettingsComponent,
		canActivate: [loggedInGuard],
	},
	{
		path: '**',
		redirectTo: '/dashboard',
	},
];
