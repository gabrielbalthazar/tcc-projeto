import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../../core/api.config';
import { Cliente, ClientePayload } from '../../core/models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClientesService {

  private readonly API = `${API_URL}/clientes`;

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API);
  }

  createCliente(payload: ClientePayload): Observable<Cliente> {
    return this.http.post<Cliente>(this.API, payload);
  }

  updateCliente(id: string, payload: ClientePayload): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.API}/${id}`, payload);
  }
}
