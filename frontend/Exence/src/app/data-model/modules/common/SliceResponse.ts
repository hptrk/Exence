export interface SliceResponse<T> {
	content?: T[];
	page: number;
	size: number;
	first: boolean;
	last: boolean;
	hasNext: boolean;
	numberOfElements: number;
}
