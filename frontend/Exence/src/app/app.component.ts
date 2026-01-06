import { Component, inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './private/sidebar/sidebar.component';
import { SvgIcons } from './shared/svg-icons/svg-icons';
import { UserService } from './shared/user/user.service';
import { CurrentUserService } from './shared/user/current-user.service';

@Component({
	selector: 'ex-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [SidebarComponent, RouterModule],
})
export class AppComponent implements OnInit {
	private readonly userService = inject(UserService);
	private readonly currentUserService = inject(CurrentUserService);
	private readonly matIconRegistry = inject(MatIconRegistry);
	private readonly domSanitizer = inject(DomSanitizer);

	async ngOnInit(): Promise<void> {
		// Icon set
		for (const iconName of Object.values(SvgIcons)) {
			this.matIconRegistry.addSvgIcon(
				iconName,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`),
			);
		}

		try {
			const user = await this.userService.getUser();
			this.currentUserService.user = user;
		} catch {
			this.currentUserService.clearUser();
		}
	}
}
