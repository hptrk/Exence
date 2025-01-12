import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Set default theme
    const themeClass = this.themeService.getIsDarkTheme
      ? 'dark-theme'
      : 'light-theme';
    document.body.classList.add(themeClass);
  }
}
