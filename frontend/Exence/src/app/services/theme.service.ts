import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkTheme: boolean = true;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const themeClass = this.isDarkTheme ? 'dark-theme' : 'light-theme';
    document.body.className = themeClass;
  }

  get currentTheme(): boolean {
    return this.isDarkTheme;
  }
}
