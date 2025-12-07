import { Component, inject, OnInit, signal } from "@angular/core";
import { DeviceSession } from "../../../data-model/modules/session/DeviceSession";
import { SessionService } from "../session.service";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { ButtonComponent } from "../../../shared/button/button.component";
import { FormatDateFromNowPipe } from "../../../shared/pipes/format-date-from-now.pipe";
import { MatDividerModule } from "@angular/material/divider";
import { SnackbarService } from "../../../shared/snackbar/snackbar.service";

@Component({
	selector: 'ex-sessions-list',
	templateUrl: './sessions-list.component.html',
	styleUrl: './sessions-list.component.scss',
	imports: [
		MatIconModule,
		MatDividerModule,
		ButtonComponent,
		FormatDateFromNowPipe
	],
})
export class SessionsListComponent implements OnInit {
	private readonly sessionService = inject(SessionService);
	private readonly snackbarService = inject(SnackbarService);
	
	otherSessions = signal<DeviceSession[]>([]);
	currentSession = signal<DeviceSession | undefined>(undefined);

	async ngOnInit(): Promise<void> {
		await this.initialize();
	}

	private async initialize(): Promise<void> {
		return Promise.all([
			this.sessionService.list(),
		]).then(([sessions]) => {
			this.otherSessions.set(sessions.filter(session => !session.currentSession));
			this.currentSession.set(sessions.find(session => session.currentSession));
		});
	} 


	async deleteSession(sessionId?: string): Promise<void> {
		if (!sessionId) return;
		await this.sessionService.deleteSession(sessionId);
		await this.initialize();
		this.snackbarService.showSuccess('Successfully deleted session');
	}

	async deleteAllSessions(): Promise<void> {
		await this.sessionService.deleteAllSessions();
		await this.initialize();
		this.snackbarService.showSuccess('Successfully deleted all sessions');
	}
}