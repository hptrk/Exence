import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
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
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { ProfileDialogComponent } from '../profile-dialog/profile-dialog.component';
import { DialogService } from '../../shared/dialog/dialog.service';
import { LanguageSelectComponent } from '../profile-dialog/user-settings/language-select/language-select.component';
import { LanguageService } from '../profile-dialog/user-settings/language-select/language.service';
import { CurrentUserService } from '../../shared/user/current-user.service';
import { StopPropagationDirective } from 'src/app/shared/stop-propagation.directive';

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
		LanguageSelectComponent,
		TranslatePipe,
		StopPropagationDirective,
	],
})
export class SidebarComponent extends BaseComponent {
	private readonly router = inject(Router);
	private readonly dialog = inject(DialogService);
	private readonly languageService = inject(LanguageService);
	readonly navigationService = inject(NavigationService);
	readonly display = inject(DisplaySizeService);
	readonly themeService = inject(DisplayThemeService);
	readonly currentUserService = inject(CurrentUserService);

	initialLang = computed<string>(() => this.languageService.language());

	isAdminUser = computed<boolean>(() => this.currentUserService.isAdmin());

	toggleTheme(): void {
		this.themeService.toggleTheme();
	}

	logout(): void {
		this.router.navigateByUrl(this.navigationService.account().logout());
	}

	openProfileDialog(): void {
		this.dialog.openNonModal(ProfileDialogComponent, undefined, {
			height: '80vh',
			width: '100%',
			maxWidth: '1200px',
		});
	}

	setLang(lang: string): void {
		this.languageService.setLanguage(lang);
	}
}
