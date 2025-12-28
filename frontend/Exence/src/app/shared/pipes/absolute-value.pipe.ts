import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'absoluteValue',
})
export class AbsoluteValuePipe implements PipeTransform {
	transform(value?: number): number | undefined {
		return value ? Math.abs(value) : value;
	}
}