import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DisplaySizeService } from '../../shared/display-size.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { AdminAuditLogComponent } from './admin-audit-log/admin-audit-log.component';
import { AdminRegistrationComponent } from './admin-registration/admin-registration.component';
import { AdminStatisticsListComponent } from './admin-statistics-list/admin-statistics-list.component';
import { EmailBroadcastComponent } from './email-broadcast/email-broadcast.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';

@Component({
	selector: 'ex-admin',
	templateUrl: './admin.component.html',
	styleUrl: './admin.component.scss',
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatDividerModule,
		AdminAuditLogComponent,
		AdminStatisticsListComponent,
		AdminRegistrationComponent,
		EmailBroadcastComponent,
		SystemSettingsComponent,
		TranslatePipe,
	],
})
export class AdminComponent {
	readonly display = inject(DisplaySizeService);

	selectedIndex = 0;
}
