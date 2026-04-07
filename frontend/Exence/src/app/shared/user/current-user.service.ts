import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { UserGet } from '../../data-model/modules/auth/UserGet';
import { Role } from '../../data-model/modules/auth/Role';

@Injectable({
	providedIn: 'root',
})
export class CurrentUserService {
	private _user: WritableSignal<UserGet | null | undefined> = signal(null);

	isAuthenticated = computed(() => !!this._user());

	isAdmin = computed(() => this.isAuthenticated() && this._user()!.role === Role.ADMIN);

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
