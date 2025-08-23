import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Transaction } from '../data-model/modules/transaction/Transaction';

@Injectable({
	providedIn: 'root',
})
export class TransactionService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = 'http://localhost:8080/transactions';

	private readonly transactions = signal<Transaction[]>([]);

	getTransactions() {
		return this.transactions;
	}

	loadTransactions() {
		return this.getTransactionsForLoggedInUser().pipe(tap(transactions => this.transactions.set(transactions)));
	}

	private getTransactionsForLoggedInUser(): Observable<Transaction[]> {
		return this.http.get<Transaction[]>(`${this.baseUrl}/user`);
	}

	createTransaction(transaction: Transaction): Observable<Transaction> {
		return this.http.post<Transaction>(this.baseUrl, transaction).pipe(
			tap(newTransaction => {
				const current = this.transactions();
				this.transactions.set([...current, newTransaction]);
			}),
		);
	}

	updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
		return this.http.put<Transaction>(`${this.baseUrl}/${id}`, transaction).pipe(
			tap(updatedTransaction => {
				const current = this.transactions();
				const index = current.findIndex(t => t.id === id);
				if (index !== -1) {
					const updated = [...current];
					updated[index] = updatedTransaction;
					this.transactions.set(updated);
				}
			}),
		);
	}

	changeTransactionCategory(transactionId: number, newCategoryId: number): Observable<Transaction> {
		return this.http
			.patch<Transaction>(`${this.baseUrl}/${transactionId}/change-category`, {
				newCategoryId,
			})
			.pipe(
				tap(updatedTransaction => {
					const current = this.transactions();
					const index = current.findIndex(t => t.id === transactionId);
					if (index !== -1) {
						const updated = [...current];
						updated[index] = updatedTransaction;
						this.transactions.set(updated);
					}
				}),
			);
	}

	deleteTransaction(id: number): Observable<void> {
		return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
			tap(() => {
				const current = this.transactions();
				this.transactions.set(current.filter(t => t.id !== id));
			}),
		);
	}
}
