import { Component, inject, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { SidebarComponent } from './private/sidebar/sidebar.component';
import { SvgIcons } from './shared/svg-icons/svg-icons';
import { CurrentUserService } from './shared/user/current-user.service';
import { UserService } from './shared/user/user.service';

@Component({
	selector: 'ex-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [SidebarComponent, RouterModule],
})
export class AppComponent implements OnInit {
	private readonly currentUserService = inject(CurrentUserService);
	private readonly matIconRegistry = inject(MatIconRegistry);
	private readonly domSanitizer = inject(DomSanitizer);
	private readonly userService = inject(UserService);

	ngOnInit(): void {
		// Icon set
		for (const iconName of Object.values(SvgIcons)) {
			this.matIconRegistry.addSvgIcon(
				iconName,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`),
			);
		}

		from(this.userService.getUser()).subscribe({
			next: user => {
				this.currentUserService.user = user;
			},
			error: () => {
				this.currentUserService.clearUser();
			},
		});
	}
}
