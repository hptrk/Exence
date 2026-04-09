import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { BroadcastEmailRequest } from '../../data-model/modules/admin/BroadcastEmailRequest';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AdminEmailService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/admin/email';

	public sendBroadcastEmail(request: BroadcastEmailRequest): Promise<void> {
		return lastValueFrom(this.http.post<void>(`${this.baseUrl}/broadcast`, request));
	}
}
