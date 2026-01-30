export interface PagedResponse<T> {
	content?: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	first: boolean;
	last: boolean;
	numberOfElements: number;
}