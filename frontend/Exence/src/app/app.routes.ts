import { Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { DebtsComponent } from './components/pages/debts/debts.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { GoalsComponent } from './components/pages/goals/goals.component';
import { StatisticsComponent } from './components/pages/statistics/statistics.component';
import { TransactionsComponent } from './components/pages/transactions/transactions.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'goals', component: GoalsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'debts', component: DebtsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '/dashboard' },
];
