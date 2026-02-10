import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs';

export function toRawValueSignal<T>(control: AbstractControl<unknown, T>): Signal<T> {
	return toSignal(control.valueChanges.pipe(map(() => control.getRawValue() as T)), { initialValue: control.getRawValue() as T });
}