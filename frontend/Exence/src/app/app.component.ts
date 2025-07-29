import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { TransactionService } from './services/transaction.service';
import { CategoryService } from './services/category.service';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './layout/frame/sidebar/sidebar.component';

@Component({
  selector: 'ex-root',
  imports: [SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);

  ngOnInit() {
    // Set default theme
    const themeClass = this.themeService.isDarkTheme() ? 'dark-theme' : 'light-theme';
    document.body.classList.add(themeClass);

    // Load user
    this.authService.fetchUserData().subscribe();

    // Load transactions
    this.transactionService.loadTransactions().subscribe();

    // Load categories
    this.categoryService.loadCategories().subscribe();
  }
}
