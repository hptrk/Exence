import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'ex-empty-statistic-card',
	template: `
		<mat-card class="justify-content-center align-items-center">
			<mat-icon size="xxl">add_2</mat-icon>
		</mat-card>
	`,
	styles: `
		:host {
			cursor: pointer;
			min-width: 350px;
			max-width: 600px;
			width: 100%;
			height: 100%;

			&:hover {
				mat-card.mat-mdc-card {
					background-color: color-mix(in srgb, var(--app-card-color), white 5%);
					box-shadow: 1px 1px 10px var(--shadow-color);
				}
			}
		}

		mat-card.mat-mdc-card {
			transition:
				background-color,
				transform 0.3s ease-in-out;
			height: 100%;
			width: 100%;
			border: 2px solid var(--primary-color);
		}

		mat-icon {
			color: var(--primary-color);
		}
	`,
	imports: [MatCardModule, MatIconModule],
})
export class EmptyStatisticCardComponent {}
