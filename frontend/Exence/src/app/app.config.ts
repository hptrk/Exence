import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withInterceptorsFromDi()),
		provideCharts(withDefaultRegisterables()),
	],
};
