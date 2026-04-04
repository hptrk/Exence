import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { UserGet } from '../../data-model/modules/auth/UserGet';

@Injectable({
	providedIn: 'root',
})
export class CurrentUserService {
	private _user: WritableSignal<UserGet | null | undefined> = signal(null);

	isAuthenticated = computed(() => !!this._user());

	get user(): Signal<UserGet> {
		return this._user.asReadonly() as Signal<UserGet>;
	}
	set user(user: UserGet | null | undefined) {
		this._user.set(user);
	}

	clearUser(): void {
		this.user = undefined;
	}
}
