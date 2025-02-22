import { Component, computed, inject, OnInit } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ThemeService } from './services/theme.service';
import { TransactionService } from './services/transaction.service';
import { CategoryService } from './services/category.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly transactionService = inject(TransactionService);
  private readonly categoryService = inject(CategoryService);

  ngOnInit() {
    // Set default theme
    const themeClass = this.themeService.isDarkTheme()
      ? 'dark-theme'
      : 'light-theme';
    document.body.classList.add(themeClass);

    // Load user
    this.authService.fetchUserData().subscribe();

    // Load transactions
    this.transactionService.loadTransactions().subscribe();

    // Load categories
    this.categoryService.loadCategories().subscribe();
  }
}
