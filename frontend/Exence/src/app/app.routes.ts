import { Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { DebtsComponent } from './components/pages/debts/debts.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { GoalsComponent } from './components/pages/goals/goals.component';
import { StatisticsComponent } from './components/pages/statistics/statistics.component';
import { TransactionsComponent } from './components/pages/transactions/transactions.component';
import { LoginComponent } from './components/pages/auth/login/login.component';
import { RegisterComponent } from './components/pages/auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';

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
