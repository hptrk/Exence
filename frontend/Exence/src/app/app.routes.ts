import { Routes } from '@angular/router';

import { DashboardComponent } from './private/dashboard/dashboard.component';
import { DebtsComponent } from './private/debts/debts.component';
import { GoalsComponent } from './private/goals/goals.component';
import { PrivateComponent } from './private/private.component';
import { StatisticsComponent } from './private/statistics/statistics.component';
import { TransactionsAndCategoriesComponent } from './private/transactions-and-categories/transactions-and-categories.component';
import { publicRoutes } from './public/public.routes';
import { hasChangesGuard } from './shared/auth/guard/has-changes.guard';
import { loggedInGuard } from './shared/auth/guard/logged-in.guard';

export const routes: Routes = [
	...publicRoutes,
	{
		path: '',
		component: PrivateComponent,
		canActivate: [loggedInGuard],
		children: [
			{
				path: '',
				redirectTo: '/dashboard',
				pathMatch: 'full',
			},
			{
				path: 'dashboard',
				component: DashboardComponent,
			},
			{
				path: 'goals',
				component: GoalsComponent,
			},
			{
				path: 'statistics',
				component: StatisticsComponent,
				canDeactivate: [hasChangesGuard],
			},
			{
				path: 'transactions',
				component: TransactionsAndCategoriesComponent,
			},
			{
				path: 'debts',
				component: DebtsComponent,
			},
		],
	},
	{
		path: '**',
		redirectTo: '/dashboard',
	},
];
