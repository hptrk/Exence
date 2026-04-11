import { Routes } from '@angular/router';

import { DashboardComponent } from './private/dashboard/dashboard.component';
import { DebtsComponent } from './private/debts/debts.component';
import { GoalsComponent } from './private/goals/goals.component';
import { PrivateComponent } from './private/private.component';
import { StatisticsComponent } from './private/statistics/statistics.component';
import { TransactionsAndCategoriesComponent } from './private/transactions-and-categories/transactions-and-categories.component';
import { LandingComponent } from './public/landing/landing.component';
import { publicRoutes } from './public/public.routes';
import { hasChangesGuard } from './shared/auth/guard/has-changes.guard';
import { loggedInGuard } from './shared/auth/guard/logged-in.guard';
import { loggedOutGuard } from './shared/auth/guard/logged-out.guard';
import { AdminComponent } from './private/admin/admin.component';
import { InvestmentsComponent } from './private/investments/investments.component';
import { adminGuard } from './shared/auth/guard/admin.guard';

export const routes: Routes = [
	...publicRoutes,
	{
		path: '',
		component: LandingComponent,
		canActivate: [loggedOutGuard],
		pathMatch: 'full',
	},
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
			{
				path: 'investments',
				component: InvestmentsComponent,
			},
			{
				path: 'admin',
				component: AdminComponent,
				canActivate: [adminGuard],
			},
		],
	},
	{
		path: '**',
		redirectTo: '/',
	},
];
