import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../services/theme.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}
  @ViewChild('sidenavContainer') sidenavContainer!: ElementRef;

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.querySelector('mat-sidenav-container')?.classList.add('loaded');
      this.cdr.detectChanges();
    }, 0);
  }
}
