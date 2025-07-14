import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chico, CreateChicoRequest, UpdateChicoRequest, ApiResponse } from '../models/chico.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChicoService {
  private readonly apiUrl = `${environment.apiUrl}/chicos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Chico[]>> {
    return this.http.get<ApiResponse<Chico[]>>(this.apiUrl);
  }

  getByDni(dni: string): Observable<ApiResponse<Chico>> {
    return this.http.get<ApiResponse<Chico>>(`${this.apiUrl}/${dni}`);
  }

  create(chico: CreateChicoRequest): Observable<ApiResponse<Chico>> {
    return this.http.post<ApiResponse<Chico>>(this.apiUrl, chico);
  }

  update(dni: string, chico: UpdateChicoRequest): Observable<ApiResponse<Chico>> {
    return this.http.put<ApiResponse<Chico>>(`${this.apiUrl}/${dni}`, chico);
  }

  delete(dni: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${dni}`);
  }

  assignToMicro(dni: string, microPatente: string): Observable<ApiResponse<Chico>> {
    return this.http.post<ApiResponse<Chico>>(`${this.apiUrl}/${dni}/assign-micro`, {
      microPatente
    });
  }

  removeFromMicro(dni: string): Observable<ApiResponse<Chico>> {
    return this.http.delete<ApiResponse<Chico>>(`${this.apiUrl}/${dni}/micro`);
  }
}