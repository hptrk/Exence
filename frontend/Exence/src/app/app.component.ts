import { Component, inject, OnInit } from '@angular/core';
// import { TransactionService } from './private/transactions/transaction.service';
// import { CategoryService } from './private/category.service';
import { SidebarComponent } from './private/sidebar/sidebar.component';
import { MatIconRegistry } from '@angular/material/icon';
import { SvgIcons } from './shared/svg-icons/svg-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpService } from './shared/http/http.service';
import { AuthService } from './public/auth.service';
import { CurrentUserService } from './private/current-user.service';

@Component({
	selector: 'ex-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
	imports: [SidebarComponent, RouterModule],
	providers: [HttpService, AuthService, CurrentUserService]
})
export class AppComponent implements OnInit {
	// private transactionService = inject(TransactionService);
	// private categoryService = inject(CategoryService);
	private matIconRegistry = inject(MatIconRegistry);
	private domSanitizer = inject(DomSanitizer);

	ngOnInit() {
		// Load user

		// Load transactions
		// this.transactionService.loadTransactions().subscribe();

		// Load categories
		// this.categoryService.loadCategories().subscribe();

		// Icon set
		for (let iconName of Object.values(SvgIcons)) {
			this.matIconRegistry.addSvgIcon(
				iconName,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${iconName}.svg`),
			);
		}
	}
}
