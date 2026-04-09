import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { LayoutModule } from '@angular/cdk/layout';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { ErrorStateMatcher, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { enUS } from 'date-fns/locale';
import { CookieService } from 'ngx-cookie-service';
import { routes } from './app.routes';
import { authInterceptor } from './shared/auth/interceptors/auth.interceptor';
import { refreshTokenInterceptor } from './shared/auth/interceptors/refresh-token.interceptor';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import './shared/i18n/locale-parity-check';
import { languageInterceptor } from './shared/auth/interceptors/language.interceptor';
import { AbstractControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

class TouchedErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: AbstractControl | null): boolean {
		return !!(control?.invalid && control.touched);
	}
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideZonelessChangeDetection(),
		provideRouter(routes),
		// TODO remove depracated angular animations
		// eslint-disable-next-line
		provideAnimations(),
		provideHttpClient(withInterceptors([languageInterceptor, authInterceptor, refreshTokenInterceptor])),
		importProvidersFrom(LayoutModule),
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: { appearance: 'outline' },
		},
		{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher },
		{ provide: MAT_DATE_LOCALE, useValue: enUS },
		provideDateFnsAdapter(),
		CookieService,
		provideHttpClient(),
		provideTransloco({
			config: {
				availableLangs: ['hu', 'en', 'de', 'es', 'fr', 'it', 'pl', 'sk'],
				defaultLang: 'en',
				fallbackLang: 'en',
				missingHandler: {
					useFallbackTranslation: true,
				},
				scopes: {
					keepCasing: true,
				},
				reRenderOnLangChange: true,
				prodMode: !isDevMode(),
			},
			loader: TranslocoHttpLoader,
		}),
	],
};
