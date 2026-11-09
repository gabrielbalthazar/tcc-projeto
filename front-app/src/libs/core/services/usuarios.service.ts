import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { UserRole } from '../models/user.model';
import { UsuarioResumo } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService {

  private readonly API = `${API_URL}/usuarios`;

  constructor(private http: HttpClient) { }

  getUsuarios(tipo?: UserRole): Observable<UsuarioResumo[]> {
    const params = tipo ? new HttpParams().set('tipo', tipo) : undefined;
    return this.http.get<UsuarioResumo[]>(this.API, { params });
  }
}
