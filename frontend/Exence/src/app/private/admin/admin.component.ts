import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DisplaySizeService } from '../../shared/display-size.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { AdminRegistrationComponent } from './admin-registration/admin-registration.component';
import { AdminStatisticsListComponent } from './admin-statistics-list/admin-statistics-list.component';
import { EmailBroadcastComponent } from './email-broadcast/email-broadcast.component';

@Component({
	selector: 'ex-admin',
	templateUrl: './admin.component.html',
	styleUrl: './admin.component.scss',
	imports: [
		CommonModule,
		MatTabsModule,
		MatIconModule,
		MatDividerModule,
		AdminStatisticsListComponent,
		AdminRegistrationComponent,
		EmailBroadcastComponent,
		TranslatePipe,
	],
})
export class AdminComponent {
	readonly display = inject(DisplaySizeService);

	selectedIndex = 0;
}
