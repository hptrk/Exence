import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly isDark = signal(true);
  private readonly document = inject(DOCUMENT);

  isDarkTheme() {
    return this.isDark;
  }

  constructor() {
    this.updateThemeClass();
  }

  toggleTheme() {
    this.isDark.update((prev) => !prev);
    this.updateThemeClass();
  }
  private updateThemeClass(): void {
    const themeClass = this.isDark() ? 'dark-theme' : 'light-theme';
    this.document.body.className = themeClass;
  }
}
