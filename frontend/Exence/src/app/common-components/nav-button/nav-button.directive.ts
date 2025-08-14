import { Directive } from '@angular/core';

@Directive({
	selector: '[ex-nav-button]',
	standalone: true,
	host: {
		'class': 'ex-nav-button'
	}
})
export class NavButtonDirective {
}
