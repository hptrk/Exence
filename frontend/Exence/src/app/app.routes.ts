import { Routes } from '@angular/router';

import { PrivateComponent } from './private/private.component';
import { publicRoutes } from './public/public.routes';
import { hasChangesGuard } from './shared/auth/guard/has-changes.guard';
import { loggedInGuard } from './shared/auth/guard/logged-in.guard';
import { loggedOutGuard } from './shared/auth/guard/logged-out.guard';
import { adminGuard } from './shared/auth/guard/admin.guard';

export const routes: Routes = [
	...publicRoutes,
	{
		path: '',
		loadComponent: () => import('./public/landing/landing.component').then(m => m.LandingComponent),
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
				loadComponent: () => import('./private/dashboard/dashboard.component').then(m => m.DashboardComponent),
			},
			{
				path: 'goals',
				loadComponent: () => import('./private/goals/goals.component').then(m => m.GoalsComponent),
			},
			{
				path: 'statistics',
				loadComponent: () =>
					import('./private/statistics/statistics.component').then(m => m.StatisticsComponent),
				canDeactivate: [hasChangesGuard],
			},
			{
				path: 'transactions',
				loadComponent: () =>
					import('./private/transactions-and-categories/transactions-and-categories.component').then(
						m => m.TransactionsAndCategoriesComponent,
					),
			},
			{
				path: 'debts',
				loadComponent: () => import('./private/debts/debts.component').then(m => m.DebtsComponent),
			},
			{
				path: 'investments',
				loadComponent: () =>
					import('./private/investments/investments.component').then(m => m.InvestmentsComponent),
			},
			{
				path: 'admin',
				loadComponent: () => import('./private/admin/admin.component').then(m => m.AdminComponent),
				canActivate: [adminGuard],
			},
		],
	},
	{
		path: '**',
		redirectTo: '/',
	},
];
