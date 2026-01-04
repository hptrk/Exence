import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { User } from '../../data-model/modules/auth/User';

@Injectable({
	providedIn: 'root'
})
export class CurrentUserService {
	private _user: WritableSignal<User | null> = signal(null);

	get user(): Signal<User> { return this._user.asReadonly() as Signal<User>; }

	get isLoggedIn(): boolean {
		return !!this._user();
	}

	setUser(user: User): void {
		this._user.set(user);
	}
	
	clearUser(): void {
		this._user.set(null);
	}
}