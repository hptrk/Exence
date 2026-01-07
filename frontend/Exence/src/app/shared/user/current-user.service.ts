import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { User } from '../../data-model/modules/auth/User';

@Injectable({
	providedIn: 'root'
})
export class CurrentUserService {
	private _user: WritableSignal<User | null | undefined> = signal(null);

	get user(): Signal<User> { return this._user.asReadonly() as Signal<User>; }
	set user(user: User | null | undefined) { this._user.set(user); }
	
	isAuthenticated = computed(() => !!this._user());

	clearUser(): void {
		this.user = undefined;
	}
}