import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { User } from '../../data-model/modules/auth/User';

@Injectable({
	providedIn: 'root'
})
export class CurrentUserService {
	private _user: WritableSignal<User | null> = signal(null);

	get user(): Signal<User> { return this._user.asReadonly() as Signal<User>; }
	
	getIsLoggedIn(): boolean {
		return this._user() ? true : false
	}

	setUser(user: User | null): void {
		if (!user) return;
		
		this._user.set(user);
	}
	
	clearUser(): void {
		this._user.set(null);
	}
}