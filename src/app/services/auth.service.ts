import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string;
  isConfirmed: boolean;
  verificationStatus: string;
}

interface LoginResponse {
  message: string;
  success: boolean;
  statusCode: number;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.restoreAuthState();
  }

  private restoreAuthState(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      this.isAuthenticatedSubject.next(true);
      this.userSubject.next(user);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('http://localhost:5000/api/v1/auth/login', { email, password }, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Login failed');
          }
          if (response.user.role !== 'admin') {
            throw new Error('non_admin_user');
          }
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.isAuthenticatedSubject.next(true);
          this.userSubject.next(response.user);
          const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        }),
        catchError((error) => {
          if (error.message === 'non_admin_user') {
            return throwError(() => ({
              message: 'Only admins can access this portal',
              code: 'non_admin_user'
            }));
          }
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.http
      .post('http://localhost:5000/api/v1/auth/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.clearAuthState();
        },
        error: () => {
          this.clearAuthState();
        }
      });
  }

  private clearAuthState(): void {
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUser(): User | null {
    return this.userSubject.value;
  }
}