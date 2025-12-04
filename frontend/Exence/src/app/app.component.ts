import { Component, inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './private/sidebar/sidebar.component';
import { SvgIcons } from './shared/svg-icons/svg-icons';
import { CookiesService } from './shared/auth/cookies.service';
import { AuthService } from './shared/auth/auth.service';
import { CurrentUserService } from './private/current-user.service';

@Component({
	selector: 'ex-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [SidebarComponent, RouterModule],
})
export class AppComponent implements OnInit {
	private matIconRegistry = inject(MatIconRegistry);
	private domSanitizer = inject(DomSanitizer);
	private cookies = inject(CookiesService);
	private authService = inject(AuthService);
	private currentUserService = inject(CurrentUserService);

	ngOnInit() {
		// Icon set
		for (let iconName of Object.values(SvgIcons)) {
			this.matIconRegistry.addSvgIcon(
				iconName,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`),
			);
		}
	}
}
