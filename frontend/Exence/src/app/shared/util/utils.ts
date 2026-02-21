import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { TransactionFilter } from '../../data-model/modules/transaction/TransactionFilter';
import { TransactionType } from '../../data-model/modules/transaction/TransactionType';

export function toRawValueSignal<T>(control: AbstractControl<unknown, T>): Signal<T> {
	return toSignal(control.valueChanges.pipe(map(() => control.getRawValue() as T)), {
		initialValue: control.getRawValue() as T,
	});
}

export function mapToTransactionFilter(queryParam: ParamMap): TransactionFilter {
	const filter: TransactionFilter = {} as TransactionFilter;
	if (queryParam.get('keyword')) filter.keyword = queryParam.get('keyword')!;
	if (queryParam.get('dateFrom')) filter.dateFrom = queryParam.get('dateFrom')!;
	if (queryParam.get('dateTo')) filter.dateTo = queryParam.get('dateTo')!;
	if (queryParam.get('categoryId')) filter.categoryId = +queryParam.get('categoryId')!;
	if (queryParam.get('type')) filter.type = queryParam.get('type')! as TransactionType;
	if (queryParam.get('amountFrom')) filter.amountFrom = parseFloat(queryParam.get('amountFrom')!);
	if (queryParam.get('amountTo')) filter.amountTo = parseFloat(queryParam.get('amountTo')!);
	if (queryParam.get('recurring')) filter.recurring = queryParam.get('recurring') === 'true';
	return filter;
}
