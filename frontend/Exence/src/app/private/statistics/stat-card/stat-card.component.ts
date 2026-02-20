import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { InfoButtonComponent } from '../../../shared/info-button/info-button.component';
import { CurrencyPipe } from '@angular/common';
import { MaterialIcon } from '../../../data-model/modules/category/MaterialIcon';

export interface StatCardDTO {
	label: string;
	value: number;
	changePercentage?: number;
	trend?: 'UP' | 'DOWN' | 'NEUTRAL';
	contextLabel?: string;
	icon?: {
		icon: MaterialIcon;
		color: string;
	};
}

interface StatCardAssetInfo {
	prefix: string;
	suffix: string;
}

@Component({
	selector: 'ex-stat-card',
	templateUrl: './stat-card.component.html',
	styleUrl: './stat-card.component.scss',
	imports: [MatCardModule, MatIconModule, InfoButtonComponent, CurrencyPipe],
})
export class StatCardComponent {
	data = input.required<StatCardDTO>();
	info = input.required<string>();
	type = input<'metric' | 'spotlight'>('spotlight');
	valueType = input<'currency' | 'percentage'>('currency');

	assets = computed<StatCardAssetInfo>(() => {
		switch (this.data().trend) {
			case 'UP':
				return { prefix: '+', suffix: 'arrow_upward' };
			case 'DOWN':
				return { prefix: '-', suffix: 'arrow_downward' };
			default:
				return { prefix: '', suffix: 'check_indeterminate_small' };
		}
	});
}
