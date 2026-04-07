import { inject, Injectable } from '@angular/core';
import { HttpService } from './http/http.service';
import { SupportedCurrency } from '../data-model/modules/user-settings/SupportedCurrency';
import { lastValueFrom } from 'rxjs';
import { format } from 'date-fns';

export interface ExchangeRateRequest {
	from: SupportedCurrency;
	to: SupportedCurrency;
	date: Date;
}

@Injectable({
	providedIn: 'root',
})
export class ExchangeRateService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/exchange-rates';

	public getRate(request: ExchangeRateRequest): Promise<number> {
		return lastValueFrom(
			this.http.get<number>(this.baseUrl, {
				from: request.from,
				to: request.to,
				date: format(request.date, 'yyyy-MM-dd'),
			}),
		);
	}
}
