import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'absoluteValue',
})
export class AbsoluteValuePipe implements PipeTransform {
	transform(value?: number): number | undefined {
		return value !== undefined && value !== null ? Math.abs(value) : value;
	}
}