import { Routes } from "@angular/router";
import { PublicComponent } from "./public.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { EmailVerificationComponent } from "./email-verification/email-verification.component";

export const publicRoutes: Routes = [{
	path: 'public',
	component: PublicComponent,
	children: [
		{ path: 'login', component: LoginComponent },
		{ path: 'register', component: RegistrationComponent },
		{ path: 'forgot-password', component: ForgotPasswordComponent },
		{ path: 'verify-email', component: EmailVerificationComponent }
	]
}];