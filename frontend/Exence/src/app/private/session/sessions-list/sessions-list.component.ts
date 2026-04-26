import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DeviceSession } from '../../../data-model/modules/session/DeviceSession';
import { ButtonComponent } from '../../../shared/button/button.component';
import { FormatDateFromNowPipe } from '../../../shared/pipes/format-date-from-now.pipe';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { SessionService } from '../session.service';
import { TranslocoService } from '@jsverse/transloco';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
	selector: 'ex-sessions-list',
	templateUrl: './sessions-list.component.html',
	styleUrl: './sessions-list.component.scss',
	imports: [MatIconModule, MatDividerModule, ButtonComponent, FormatDateFromNowPipe, TranslatePipe],
})
export class SessionsListComponent implements OnInit {
	private readonly sessionService = inject(SessionService);
	private readonly snackbarService = inject(SnackbarService);
	private readonly translocoService = inject(TranslocoService);

	otherSessions = signal<DeviceSession[]>([]);
	currentSession = signal<DeviceSession | undefined>(undefined);

	ngOnInit(): void {
		this.initialize();
	}

	async deleteSession(sessionId?: string): Promise<void> {
		if (!sessionId) return;
		await this.sessionService.deleteSession(sessionId);
		await this.initialize();
		this.snackbarService.showSuccess(this.translocoService.translate('sessionList.deleted'));
	}

	async deleteAllSessions(): Promise<void> {
		await this.sessionService.deleteAllSessions();
		await this.initialize();
		this.snackbarService.showSuccess(this.translocoService.translate('sessionList.deletedAll'));
	}

	private async initialize(): Promise<void> {
		return Promise.all([this.sessionService.list()]).then(([sessions]) => {
			this.otherSessions.set(sessions.filter(session => !session.currentSession));
			this.currentSession.set(sessions.find(session => session.currentSession));
		});
	}
}
