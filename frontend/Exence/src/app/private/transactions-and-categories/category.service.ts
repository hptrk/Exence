import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../shared/http/http.service';
import { Category } from '../../data-model/modules/category/Category';
import { CategorySummaryResponse } from '../../data-model/modules/category/CategorySummaryResponse';
import { CategoryFilter } from '../../data-model/modules/category/CategoryFilter';
import { CategoryType } from '../../data-model/modules/category/CategoryType';
import { getFilters } from '../../shared/util/utils';

@Injectable({
	providedIn: 'root',
})
export class CategoryService {
	private readonly http = inject(HttpService);

	private baseUrl = '/api/categories';

	public get(id: number): Promise<Category> {
		return lastValueFrom(this.http.get<Category>(`${this.baseUrl}/${id}`));
	}

	public list(): Promise<Category[]> {
		return lastValueFrom(this.http.get<Category[]>(this.baseUrl));
	}

	public listTop(filters: CategoryFilter): Promise<CategorySummaryResponse[]> {
		return lastValueFrom(
			this.http.get<CategorySummaryResponse[]>(`${this.baseUrl}/top`, { ...getFilters(filters) }),
		);
	}

	public async listTopAll(): Promise<Record<CategoryType, CategorySummaryResponse[]>> {
		const [expense, income, mixed] = await Promise.all([
			this.listTop({ type: CategoryType.EXPENSE }),
			this.listTop({ type: CategoryType.INCOME }),
			this.listTop({ type: CategoryType.MIXED }),
		]);
		return {
			[CategoryType.EXPENSE]: expense,
			[CategoryType.INCOME]: income,
			[CategoryType.MIXED]: mixed,
		};
	}

	public create(request: Category): Promise<Category> {
		return lastValueFrom(this.http.post<Category>(this.baseUrl, request));
	}

	public update(request: Category): Promise<Category> {
		return lastValueFrom(this.http.put<Category>(`${this.baseUrl}/${request.id}`, request));
	}

	public delete(id: number): Promise<void> {
		return lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
	}
}
