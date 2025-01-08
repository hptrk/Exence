import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Set default theme
    const themeClass = this.themeService.currentTheme
      ? 'dark-theme'
      : 'light-theme';
    document.body.classList.add(themeClass);
  }
}
