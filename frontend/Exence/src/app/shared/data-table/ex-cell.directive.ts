import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
	selector: '[exCell]',
	standalone: true,
})
export class ExCellDirective {
	column = input.required<string>({ alias: 'exCell' });
	template = inject(TemplateRef);
}
