import { Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './layout/auth/login/login.component';
import { RegisterComponent } from './layout/auth/register/register.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { DebtsComponent } from './layout/debts/debts.component';
import { ProfileComponent } from './layout/frame/profile/profile.component';
import { SettingsComponent } from './layout/frame/settings/settings.component';
import { GoalsComponent } from './layout/goals/goals.component';
import { StatisticsComponent } from './layout/statistics/statistics.component';
import { TransactionsComponent } from './layout/transactions/transactions.component';

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
