import { Routes } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';
import { LoginComponent } from './public/login/login.component';
import { RegisterComponent } from './public/register/register.component';
import { DashboardComponent } from './private/dashboard/dashboard.component';
import { DebtsComponent } from './private/debts/debts.component';
import { ProfileComponent } from './private/profile/profile.component'; 
import { SettingsComponent } from './private/settings/settings.component';
import { GoalsComponent } from './private/goals/goals.component';
import { StatisticsComponent } from './private/statistics/statistics.component';
import { TransactionsComponent } from './private/transactions/transactions.component';

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard],
	},
	{ path: 'goals', component: GoalsComponent, canActivate: [AuthGuard] },
	{
		path: 'statistics',
		component: StatisticsComponent,
		canActivate: [AuthGuard],
	},
	{
		path: 'transactions',
		component: TransactionsComponent,
		canActivate: [AuthGuard],
	},
	{ path: 'debts', component: DebtsComponent, canActivate: [AuthGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
	{ path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/dashboard' },
];
