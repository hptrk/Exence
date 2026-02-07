import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../shared/base-component/base.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { DisplaySizeService } from '../../shared/display-size.service';
import { DisplayThemeService } from '../../shared/display-theme.service';
import { NavigationService } from '../../shared/navigation/navigation.service';

@Component({
	selector: 'ex-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	imports: [
		CommonModule,
		RouterModule,
		MatSidenavModule,
		MatListModule,
		MatIconModule,
		MatMenuModule,
		ButtonComponent,
	],
})
export class SidebarComponent extends BaseComponent {
	private readonly router = inject(Router);
	readonly navigationService = inject(NavigationService);
	readonly display = inject(DisplaySizeService);
	readonly themeService = inject(DisplayThemeService);

	toggleTheme(): void {
		this.themeService.toggleTheme();
	}

	logout(): void {
		this.router.navigateByUrl(this.navigationService.account().logout());
	}
}
