import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseComponent } from '../../../common-components/base-component/base.component';
import { NavigationService } from '../../../services/navigation/navgiation.service';
import { NavButtonDirective } from '../../../common-components/nav-button/nav-button.directive';
import { DisplaySizeService } from '../../../services/display-size.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
	selector: 'ex-sidebar',
	imports: [RouterModule, RouterLink, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, NavButtonDirective, CommonModule, MatMenuModule],
	templateUrl: './sidebar.component.html',
})
export class SidebarComponent extends BaseComponent {
	public navigationService = inject(NavigationService);
	public display = inject(DisplaySizeService);

	toggleTheme() {
	}
}
