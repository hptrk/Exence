import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { BaseComponent } from '../../shared/base-component/base.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { NavigationService } from '../../shared/navigation/navigation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { DisplaySizeService } from '../../shared/display-size.service';
import { DisplayThemeService } from '../../shared/display-theme.service';
import { MatCardModule } from '@angular/material/card';
import { AnimatedSkeletonLoaderComponent } from '../../shared/animated-skeleton-loader/animated-skeleton-loader.component';

@Component({
	selector: 'ex-landing',
	templateUrl: './landing.component.html',
	styleUrl: './landing.component.scss',
	imports: [
		MatIconModule,
		MatCardModule,
		RouterModule,
		ButtonComponent,
		AnimatedSkeletonLoaderComponent,
		TranslatePipe,
	],
})
export class LandingComponent extends BaseComponent {
	private readonly router = inject(Router);
	readonly display = inject(DisplaySizeService);
	readonly navigationService = inject(NavigationService);
	readonly themeService = inject(DisplayThemeService);

	readonly currentYear = new Date().getFullYear();

	readonly socialLinks = {
		tamas: {
			linkedin: 'https://www.linkedin.com/in/ntamasa/',
			github: 'https://github.com/ntamasa',
		},
		patrik: {
			linkedin: 'https://www.linkedin.com/in/patrik-horanszki/',
			github: 'https://github.com/hptrk',
		},
	};

	navigateToRegister(): void {
		this.router.navigateByUrl(this.navigationService.account().register());
	}

	navigateToLogin(): void {
		this.router.navigateByUrl(this.navigationService.account().login());
	}

	scrollToTop(): void {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}
