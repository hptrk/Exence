import { Component, computed, input } from '@angular/core';

@Component({
	selector: 'ex-animated-skeleton-loader',
	template: '',
	styleUrl: './animated-skeleton-loader.component.scss',
	imports: [],
	host: {
		'[style.width]': 'width()',
		'[style.height]': 'height()',
		'[style.border-radius]': 'borderRadius()',
	},
})
export class AnimatedSkeletonLoaderComponent {
	width = input<string>('50px');
	height = input<string>('50px');
	shape = input<'rect' | 'circle'>('rect');

	borderRadius = computed(() => (this.shape() === 'rect' ? '20px' : '50%'));
}
