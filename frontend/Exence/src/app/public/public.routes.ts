import { Routes } from '@angular/router';

import { PublicComponent } from './public.component';
import { loggedOutGuard } from '../shared/auth/guard/logged-out.guard';

export const publicRoutes: Routes = [
	{
		path: 'public',
		component: PublicComponent,
		children: [
			{
				path: 'login',
				loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
				canActivate: [loggedOutGuard],
			},
			{
				path: 'register',
				loadComponent: () => import('./registration/registration.component').then(m => m.RegistrationComponent),
				canActivate: [loggedOutGuard],
			},
			{
				path: 'forgot-password',
				loadComponent: () =>
					import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
				canActivate: [loggedOutGuard],
			},
			{
				path: 'verify-email',
				loadComponent: () =>
					import('./email-verification/email-verification.component').then(m => m.EmailVerificationComponent),
			},
			{
				path: 'logout',
				loadComponent: () => import('./logout/logout.component').then(m => m.LogoutComponent),
			},
		],
	},
];
