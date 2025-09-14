import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '../../shared/base-component/base.component';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { NavButtonDirective } from '../../shared/nav-button/nav-button.directive';
import { DisplaySizeService } from '../../shared/display-size.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
	selector: 'ex-sidebar',
	imports: [
		RouterModule,
		RouterLink,
		MatSidenavModule,
		MatListModule,
		MatIconModule,
		MatButtonModule,
		NavButtonDirective,
		CommonModule,
		MatMenuModule,
	],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
})
export class SidebarComponent extends BaseComponent {
	public navigationService = inject(NavigationService);
	public display = inject(DisplaySizeService);

	toggleTheme() {}
}
