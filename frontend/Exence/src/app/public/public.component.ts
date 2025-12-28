import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'ex-public',
	template: `
		<router-outlet />
	`,
	styles: `
		:host {
			height: 100dvh;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	`,
	imports: [RouterOutlet],
})
export class PublicComponent { }