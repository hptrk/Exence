import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { from } from 'rxjs';
import { User } from '../../data-model/modules/auth/User';
import { UserService } from './user.service';

@Injectable({
	providedIn: 'root'
})
export class CurrentUserService {
	private _user: WritableSignal<User | null> = signal(null);

	get user(): Signal<User> { return this._user.asReadonly() as Signal<User>; }
	set user(user: User | null) { this._user.set(user); }
	
	isAuthenticated = computed(() => !!this._user());

	constructor(private userService: UserService) {
		from(this.userService.getUser()).subscribe({
			next: (user) => {
				this.user = user;
			},
			error: () => {
				this.clearUser();
			}
		});
	}
	
	clearUser(): void {
		this.user = null;
	}
}