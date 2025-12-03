import { Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { User } from "../data-model/modules/auth/User";

@Injectable()
export class CurrentUserService {
	private _user: WritableSignal<User | null> = signal(null);

	get user(): Signal<User> { return this._user.asReadonly() as Signal<User>; }

	setUser(user: User): void {
		if (!user) return;
		
		this._user.set(user);
	}
}