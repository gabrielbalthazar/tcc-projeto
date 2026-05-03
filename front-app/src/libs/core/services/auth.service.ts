import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginPayload, RegisterPayload, AuthResponse, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'takehub_token';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<AuthResponse> {
    // return this.http.post<AuthResponse>(`${this.API}/login`, payload).pipe(
    //   tap(res => this.saveToken(res.token))
    // );
    console.log('login chamado', payload);
    return of({ token: 'mock-token', user: { id: '1', nome: 'Ana Silva', email: payload.email, tipo: 'editor', criadoEm: new Date() } } as AuthResponse);
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    // return this.http.post<AuthResponse>(`${this.API}/register`, payload).pipe(
    //   tap(res => this.saveToken(res.token))
    // );
    console.log('register chamado', payload);
    return of({ token: 'mock-token', user: { id: '2', nome: payload.nome, email: payload.email, tipo: payload.tipo, criadoEm: new Date() } } as AuthResponse);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
}
