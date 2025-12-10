import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { LayoutModule } from '@angular/cdk/layout';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { CookieService } from 'ngx-cookie-service';
import { routes } from './app.routes';
import { authInterceptor } from './shared/auth/interceptors/auth.interceptor';
import { refreshTokenInterceptor } from './shared/auth/interceptors/refresh-token.interceptor';
import { unauthorizedInterceptor } from './shared/auth/interceptors/unauthorized.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideAnimations(),
		provideHttpClient(
			withInterceptors([
				refreshTokenInterceptor,
				authInterceptor,
				unauthorizedInterceptor,
			])
		),
		importProvidersFrom(LayoutModule),
		provideCharts(withDefaultRegisterables()),
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: { appearance: 'outline' }
		},
		CookieService,
	],
};
