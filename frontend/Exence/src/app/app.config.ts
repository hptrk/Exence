import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
	ApplicationConfig,
	importProvidersFrom,
	isDevMode,
	provideAppInitializer,
	provideZonelessChangeDetection,
	inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { LayoutModule } from '@angular/cdk/layout';
import { AbstractControl } from '@angular/forms';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { ErrorStateMatcher, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTransloco } from '@jsverse/transloco';
import { enUS } from 'date-fns/locale';
import { CookieService } from 'ngx-cookie-service';
import { routes } from './app.routes';
import { authInterceptor } from './shared/auth/interceptors/auth.interceptor';
import { languageInterceptor } from './shared/auth/interceptors/language.interceptor';
import { refreshTokenInterceptor } from './shared/auth/interceptors/refresh-token.interceptor';
import { workspaceInterceptor } from './shared/auth/interceptors/workspace.interceptor';
import './shared/i18n/locale-parity-check';
import { CurrentUserService } from './shared/user/current-user.service';
import { UserService } from './shared/user/user.service';
import { WorkspaceService } from './shared/workspace.service';
import { TranslocoHttpLoader } from './transloco-loader';
import { DialogService } from './shared/dialog/dialog.service';

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
		provideHttpClient(
			withInterceptors([languageInterceptor, authInterceptor, refreshTokenInterceptor, workspaceInterceptor]),
		),
		importProvidersFrom(LayoutModule),
		{
			provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
			useValue: { appearance: 'outline' },
		},
		{ provide: ErrorStateMatcher, useClass: TouchedErrorStateMatcher },
		{ provide: MAT_DATE_LOCALE, useValue: enUS },
		provideDateFnsAdapter(),
		CookieService,
		provideAppInitializer(() => {
			const userService = inject(UserService);
			const currentUserService = inject(CurrentUserService);
			const workspaceService = inject(WorkspaceService);
			return userService
				.getUser()
				.then(user => {
					currentUserService.user = user;
					return workspaceService.init();
				})
				.catch(() => currentUserService.clearUser());
		}),
		DialogService,
		provideServiceWorker('ngsw-worker.js', {
			enabled: !isDevMode(),
			registrationStrategy: 'registerWhenStable:30000',
		}),
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
