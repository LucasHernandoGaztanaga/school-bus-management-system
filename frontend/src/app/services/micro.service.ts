import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Micro, CreateMicroRequest, UpdateMicroRequest } from '../models/micro.model';
import { ApiResponse } from '../models/chico.model';
import { Chico } from '../models/chico.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MicroService {
  private readonly apiUrl = `${environment.apiUrl}/micros`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Micro[]>> {
    return this.http.get<ApiResponse<Micro[]>>(this.apiUrl);
  }

  getByPatente(patente: string): Observable<ApiResponse<Micro>> {
    return this.http.get<ApiResponse<Micro>>(`${this.apiUrl}/${patente}`);
  }

  create(micro: CreateMicroRequest): Observable<ApiResponse<Micro>> {
    return this.http.post<ApiResponse<Micro>>(this.apiUrl, micro);
  }

  update(patente: string, micro: UpdateMicroRequest): Observable<ApiResponse<Micro>> {
    return this.http.put<ApiResponse<Micro>>(`${this.apiUrl}/${patente}`, micro);
  }

  delete(patente: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${patente}`);
  }

  assignChofer(patente: string, choferDni: string): Observable<ApiResponse<Micro>> {
    return this.http.post<ApiResponse<Micro>>(`${this.apiUrl}/${patente}/assign-chofer`, {
      choferDni
    });
  }

  removeChofer(patente: string): Observable<ApiResponse<Micro>> {
    return this.http.delete<ApiResponse<Micro>>(`${this.apiUrl}/${patente}/chofer`);
  }

  getChicos(patente: string): Observable<ApiResponse<Chico[]>> {
    return this.http.get<ApiResponse<Chico[]>>(`${this.apiUrl}/${patente}/chicos`);
  }
}