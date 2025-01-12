import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkTheme: boolean = true;
  private themeChangeSubject = new BehaviorSubject<boolean>(this.isDarkTheme);
  themeChange$ = this.themeChangeSubject.asObservable();

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const themeClass = this.isDarkTheme ? 'dark-theme' : 'light-theme';
    document.body.className = themeClass;
    this.themeChangeSubject.next(this.isDarkTheme);
  }

  get getIsDarkTheme(): boolean {
    return this.isDarkTheme;
  }
}
