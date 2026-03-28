import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://crud-backend-qeaj.onrender.com/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/login`, { username, password }).subscribe({
        next: (response) => {
          if (response.success) {
            localStorage.setItem('currentUser', JSON.stringify({ username, userId: response.userId }));
            this.currentUserSubject.next({ username, userId: response.userId });
            observer.next(response);
          }
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  logout(): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/logout`, {}).subscribe({
        next: (response) => {
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}
