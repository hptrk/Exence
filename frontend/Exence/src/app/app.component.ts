import { Component, inject, OnInit } from '@angular/core';
// import { TransactionService } from './private/transactions/transaction.service';
// import { CategoryService } from './private/category.service';
import { SidebarComponent } from './private/sidebar/sidebar.component';
import { MatIconRegistry } from '@angular/material/icon';
import { SvgIcons } from './shared/svg-icons/svg-icons';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'ex-root',
	imports: [SidebarComponent, RouterModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
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
