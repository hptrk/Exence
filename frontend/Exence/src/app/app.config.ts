import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { LayoutModule } from '@angular/cdk/layout';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimations } from '@angular/platform-browser/animations';
import { enUS } from 'date-fns/locale';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { CookieService } from 'ngx-cookie-service';
import { routes } from './app.routes';
import { authInterceptor } from './shared/auth/interceptors/auth.interceptor';
import { refreshTokenInterceptor } from './shared/auth/interceptors/refresh-token.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZonelessChangeDetection(),
		provideRouter(routes),
		// TODO remove depracated angular animations
		// eslint-disable-next-line
		provideAnimations(),
		provideHttpClient(withInterceptors([authInterceptor, refreshTokenInterceptor])),
		importProvidersFrom(LayoutModule),
		provideCharts(withDefaultRegisterables()),
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: { appearance: 'outline' },
		},
		{ provide: MAT_DATE_LOCALE, useValue: enUS },
		provideDateFnsAdapter(),
		CookieService,
	],
};
