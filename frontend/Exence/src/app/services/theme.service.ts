import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkTheme = signal(true);

  constructor() {
    this.updateThemeClass();
  }

  toggleTheme() {
    this.isDarkTheme.update((prev) => !prev);
    this.updateThemeClass();
  }
  private updateThemeClass(): void {
    const themeClass = this.isDarkTheme() ? 'dark-theme' : 'light-theme';
    document.body.className = themeClass;
  }
}
