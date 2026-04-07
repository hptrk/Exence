import { Component, inject } from '@angular/core';
import { DisplaySizeService } from '../../shared/display-size.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AdminStatisticsService } from './admin-statistic.service';
import { AdminStatisticsListComponent } from './admin-statistics-list/admin-statistics-list.component';

@Component({
	selector: 'ex-admin',
	templateUrl: './admin.component.html',
	styleUrl: './admin.component.scss',
	imports: [CommonModule, MatTabsModule, MatIconModule, AdminStatisticsListComponent, TranslatePipe],
	providers: [AdminStatisticsService],
})
export class AdminComponent {
	readonly display = inject(DisplaySizeService);

	selectedIndex = 0;
}
