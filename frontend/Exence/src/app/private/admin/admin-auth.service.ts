import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../shared/http/http.service';
import { AuthenticationResponse } from '../../data-model/modules/auth/AuthenticationResponse';
import { lastValueFrom } from 'rxjs';
import { RegisterRequest } from '../../data-model/modules/auth/RegisterRequest';

@Injectable()
export class AdminAuthService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/admin/auth';

	public register(request: RegisterRequest): Promise<AuthenticationResponse> {
		return lastValueFrom(this.http.post<AuthenticationResponse>(`${this.baseUrl}/register`, request));
	}
}
