import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthResponse, Credentials } from '../models/auth-model';

const TOKEN_KEY = 'auth.token';
const USER_KEY = 'auth.username';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = '/api/auth';

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly username = signal<string | null>(localStorage.getItem(USER_KEY));
  readonly isLoggedIn = computed(() => this.token() !== null);

  register(credentials: Credentials) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, credentials)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  login(credentials: Credentials) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap((res) => this.handleAuth(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.username.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuth(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, res.username);
    this.token.set(res.token);
    this.username.set(res.username);
  }
}