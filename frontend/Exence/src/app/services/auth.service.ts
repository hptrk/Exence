import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // Backend API URL

  constructor(private http: HttpClient, private router: Router) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access_token);
      })
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access_token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getUserData(): Observable<any> {
    return this.http.get(`http://localhost:8080/users/me`);
  }
}
