import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/Transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/transactions';

  constructor(private http: HttpClient) {}

  getTransactionsForLoggedInUser(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/user`);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, transaction);
  }

  updateTransaction(
    id: number,
    transaction: Transaction
  ): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/${id}`, transaction);
  }

  changeTransactionCategory(
    transactionId: number,
    newCategoryId: number
  ): Observable<Transaction> {
    return this.http.patch<Transaction>(
      `${this.baseUrl}/${transactionId}/change-category`,
      { newCategoryId }
    );
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
