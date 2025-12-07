import { inject, Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { Category } from "../data-model/modules/category/Category";
import { CategorySummaryResponse } from "../data-model/modules/category/CategorySummaryResponse";
import { HttpService } from "../shared/http/http.service";

@Injectable({
	providedIn: 'root'
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

	public listTop4(): Promise<CategorySummaryResponse[]> {
		return lastValueFrom(this.http.get<CategorySummaryResponse[]>(`${this.baseUrl}/top4`));
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