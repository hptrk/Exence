import { Component, inject } from '@angular/core';
import { RouterModule, RouterLink, Router } from '@angular/router';
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
import { DisplayThemeService } from '../../shared/display-theme.service';
import { ThemeApplierDirective } from '../../shared/theme-applier.directive';
import { AuthService } from '../../shared/auth/auth.service';

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
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);
	readonly navigationService = inject(NavigationService);
	readonly display = inject(DisplaySizeService);
	readonly themeService = inject(DisplayThemeService);

	toggleTheme(): void {
		this.themeService.toggleTheme();
	}

	async logout(): Promise<void> {
		this.router.navigateByUrl(this.navigationService.account().logout());
	}
}
