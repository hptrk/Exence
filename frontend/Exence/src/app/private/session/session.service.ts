import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DeviceSession } from '../../data-model/modules/session/DeviceSession';
import { HttpService } from '../../shared/http/http.service';

@Injectable({
	providedIn: 'root'
})
export class SessionService {
	private readonly http = inject(HttpService);
	
	private baseUrl = '/api/sessions';

	public list(): Promise<DeviceSession[]> {
		return lastValueFrom(this.http.get<DeviceSession[]>(this.baseUrl));
	}

	public deleteSession(sessionId: string): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${sessionId}`));
	}

	public deleteAllSessions(): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/others`));
	}
}