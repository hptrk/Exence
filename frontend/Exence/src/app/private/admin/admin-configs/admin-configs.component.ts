import { Component } from '@angular/core';
import { AdminRegistrationComponent } from './admin-registration/admin-registration.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
	selector: 'ex-admin-configs',
	templateUrl: './admin-configs.component.html',
	styleUrl: './admin-configs.component.scss',
	imports: [MatDividerModule, AdminRegistrationComponent],
})
export class AdminConfigsComponent {}
