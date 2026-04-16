import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './private/sidebar/sidebar.component';
import { SvgIcons } from './shared/svg-icons/svg-icons';

@Component({
	selector: 'ex-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [SidebarComponent, RouterModule],
})
export class AppComponent {
	private readonly matIconRegistry = inject(MatIconRegistry);
	private readonly domSanitizer = inject(DomSanitizer);

	constructor() {
		// Icon set
		for (const iconName of Object.values(SvgIcons)) {
			this.matIconRegistry.addSvgIcon(
				iconName,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`),
			);
		}
	}
}
