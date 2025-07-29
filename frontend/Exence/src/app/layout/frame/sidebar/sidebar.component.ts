import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterModule, RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'ex-sidebar',
  imports: [RouterModule, RouterLink, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements AfterViewInit {
  private themeService = inject(ThemeService);
  private sidenavContainerElmRef = viewChild('sidenavContainer', { read: ElementRef<HTMLElement> });

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  // sidebar flash bug fix
  ngAfterViewInit() {
    setTimeout(() => {
      this.sidenavContainerElmRef()?.nativeElement.classList.add('loaded');
    }, 0);
  }
}
