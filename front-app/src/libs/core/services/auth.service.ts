import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URL } from '../api.config';
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  User,
  UserRole,
  UpdateUserPayload,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API = `${API_URL}/auth`;
  private readonly TOKEN_KEY = 'takehub_token';
  private readonly isBrowser: boolean;

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, payload).pipe(
      tap(res => this.saveToken(res.token))
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/register`, payload).pipe(
      tap(res => this.saveToken(res.token))
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API}/me`);
  }

  updateCurrentUser(dados: UpdateUserPayload): Observable<User> {
    return this.http.put<User>(`${this.API}/me`, dados);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): UserRole | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const tipo = JSON.parse(atob(payload))?.tipo;
      return typeof tipo === 'string' ? (tipo.toLowerCase() as UserRole) : null;
    } catch {
      return null;
    }
  }

  getHomeRoute(): string {
    return this.getUserRole() === 'cliente' ? '/portal' : '/dashboard';
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  private saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }
}
