import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatDialogClose } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ButtonComponent } from '../../shared/button/button.component';
import { DialogComponent } from '../../shared/dialog/dialog.service';
import { DisplaySizeService } from '../../shared/display-size.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { CurrentUserService } from '../../shared/user/current-user.service';
import { SessionsListComponent } from '../session/sessions-list/sessions-list.component';
import { ProfileInformationComponent } from './profile-information/profile-information.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';

@Component({
	selector: 'ex-profile-dialog',
	templateUrl: './profile-dialog.component.html',
	styleUrl: './profile-dialog.component.scss',
	imports: [
		CommonModule,
		MatSidenavModule,
		MatIconModule,
		MatDividerModule,
		MatDialogClose,
		ProfileInformationComponent,
		UserSettingsComponent,
		SessionsListComponent,
		ButtonComponent,
		TranslatePipe,
	],
	host: {
		'(window:beforeunload)': 'onBeforeUnload($event)',
	},
})
export class ProfileDialogComponent extends DialogComponent<void, void> {
	private readonly currentUserService = inject(CurrentUserService);
	readonly display = inject(DisplaySizeService);

	selectedPage = signal<'profile-information' | 'user-settings' | 'sessions'>('profile-information');

	username = computed<string>(() => this.currentUserService.user().username);
	usernameLetter = computed<string>(() => this.username().slice(0, 1).toUpperCase());

	onBeforeUnload(event: BeforeUnloadEvent): void {
		if (this.dialogRef.isLocked) event.preventDefault();
	}
}
