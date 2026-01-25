import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'enumValue',
	standalone: true,
})
export class EnumValuePipe implements PipeTransform {
	transform<T>(enumType: T): T[keyof T][] {
		return Object.values(enumType as object) as T[keyof T][];
	}
}
