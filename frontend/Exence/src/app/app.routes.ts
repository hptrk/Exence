import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DebtsComponent } from './components/debts/debts.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { GoalsComponent } from './components/goals/goals.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

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
