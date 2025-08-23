import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category } from '../data-model/modules/category/Category';

@Injectable({
	providedIn: 'root',
})
export class CategoryService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = 'http://localhost:8080/categories';

	private readonly categories = signal<Category[]>([]);

	loadCategories() {
		return this.getCategoriesForLoggedInUser().pipe(tap(categories => this.categories.set(categories)));
	}

	getCategories() {
		return this.categories;
	}

	private getCategoriesForLoggedInUser(): Observable<Category[]> {
		return this.http.get<Category[]>(`${this.baseUrl}/user`);
	}

	createCategory(category: Category) {
		return this.http.post<Category>(this.baseUrl, category).pipe(
			tap(newCategory => {
				const current = this.categories();
				this.categories.set([...current, newCategory]);
			}),
		);
	}

	updateCategory(id: number, category: Category) {
		return this.http.put<Category>(`${this.baseUrl}/${id}`, category).pipe(
			tap(updatedCategory => {
				const current = this.categories();
				const index = current.findIndex(c => c.id === id);
				if (index !== -1) {
					const updated = [...current];
					updated[index] = updatedCategory;
					this.categories.set(updated);
				}
			}),
		);
	}

	patchCategory(id: number, updates: Partial<Category>) {
		return this.http.patch<Category>(`${this.baseUrl}/${id}`, updates).pipe(
			tap(patchedCategory => {
				const current = this.categories();
				const index = current.findIndex(c => c.id === id);
				if (index !== -1) {
					const updated = [...current];
					updated[index] = patchedCategory;
					this.categories.set(updated);
				}
			}),
		);
	}

	deleteCategory(id: number) {
		return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
			tap(() => {
				const current = this.categories();
				this.categories.set(current.filter(c => c.id !== id));
			}),
		);
	}
}
