import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../../shared/http/http.service';
import { AchievementGet, UserAchievementGet } from '../../../data-model/modules/achievement';

@Injectable({ providedIn: 'root' })
export class AchievementService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/achievements';

	list(): Promise<AchievementGet[]> {
		return lastValueFrom(this.http.get<AchievementGet[]>(this.baseUrl));
	}

	listUnlocked(): Promise<UserAchievementGet[]> {
		return lastValueFrom(this.http.get<UserAchievementGet[]>(`${this.baseUrl}/unlocked`));
	}
}
