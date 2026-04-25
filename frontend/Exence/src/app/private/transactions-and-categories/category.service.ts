import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../shared/http/http.service';
import { CategorySummaryResponse } from '../../data-model/modules/category/CategorySummaryResponse';
import { CategoryFilter } from '../../data-model/modules/category/CategoryFilter';
import { CategoryType } from '../../data-model/modules/category/CategoryType';
import { getFilters } from '../../shared/util/utils';
import { CategoryGet } from '../../data-model/modules/category/CategoryGet';
import { CategoryCreate } from '../../data-model/modules/category/CategoryCreate';
import { CategoryPatch } from '../../data-model/modules/category/CategoryPatch';

@Injectable()
export class CategoryService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/categories';

	public get(id: number): Promise<CategoryGet> {
		return lastValueFrom(this.http.get<CategoryGet>(`${this.baseUrl}/${id}`));
	}

	public list(): Promise<CategoryGet[]> {
		return lastValueFrom(this.http.get<CategoryGet[]>(this.baseUrl));
	}

	public listTop(filters: CategoryFilter): Promise<CategorySummaryResponse[]> {
		return lastValueFrom(
			this.http.get<CategorySummaryResponse[]>(`${this.baseUrl}/top`, { ...getFilters(filters) }),
		);
	}

	public async listTopAll(): Promise<Record<Exclude<CategoryType, CategoryType.MIXED>, CategorySummaryResponse[]>> {
		const [expense, income] = await Promise.all([
			this.listTop({ type: CategoryType.EXPENSE }),
			this.listTop({ type: CategoryType.INCOME }),
		]);
		return {
			[CategoryType.EXPENSE]: expense,
			[CategoryType.INCOME]: income,
		};
	}

	public create(request: CategoryCreate): Promise<CategoryGet> {
		return lastValueFrom(this.http.post<CategoryGet>(this.baseUrl, request));
	}

	public update(categoryId: number, request: CategoryPatch): Promise<CategoryGet> {
		return lastValueFrom(this.http.patch<CategoryGet>(`${this.baseUrl}/${categoryId}`, request));
	}

	public delete(id: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
	}
}
