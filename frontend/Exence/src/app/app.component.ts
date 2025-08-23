import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { TransactionService } from './services/transaction.service';
import { CategoryService } from './services/category.service';
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './layout/frame/sidebar/sidebar.component';
import { MatIconRegistry } from '@angular/material/icon';
import { SvgIcons } from './utils/svg-icons/svg-icons';
import { DomSanitizer } from '@angular/platform-browser';

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
	private matIconRegistry = inject(MatIconRegistry);
	private domSanitizer = inject(DomSanitizer);

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

		// Icon set
		for (let iconName of Object.values(SvgIcons)) {
			this.matIconRegistry.addSvgIcon(
				iconName,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`),
			);
		}
	}
}
