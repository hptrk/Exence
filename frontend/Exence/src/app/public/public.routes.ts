import { Routes } from "@angular/router";
import { PublicComponent } from "./public.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { EmailVerificationComponent } from "./email-verification/email-verification.component";
import { LogoutComponent } from "./logout/logout.component";
import { loggedOutGuard } from "../shared/auth/guard/logged-out.guard";

export const publicRoutes: Routes = [{
	path: 'public',
	component: PublicComponent,
	children: [
		{ path: 'login', component: LoginComponent, canActivate: [loggedOutGuard] },
		{ path: 'register', component: RegistrationComponent, canActivate: [loggedOutGuard] },
		{ path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [loggedOutGuard] },
		{ path: 'verify-email', component: EmailVerificationComponent },
		{ path: 'logout', component: LogoutComponent },
	]
}];