import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chofer, CreateChoferRequest, UpdateChoferRequest } from '../models/chofer.model';
import { ApiResponse } from '../models/chico.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChoferService {
  private readonly apiUrl = `${environment.apiUrl}/choferes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Chofer[]>> {
    return this.http.get<ApiResponse<Chofer[]>>(this.apiUrl);
  }

  getByDni(dni: string): Observable<ApiResponse<Chofer>> {
    return this.http.get<ApiResponse<Chofer>>(`${this.apiUrl}/${dni}`);
  }

  create(chofer: CreateChoferRequest): Observable<ApiResponse<Chofer>> {
    return this.http.post<ApiResponse<Chofer>>(this.apiUrl, chofer);
  }

  update(dni: string, chofer: UpdateChoferRequest): Observable<ApiResponse<Chofer>> {
    return this.http.put<ApiResponse<Chofer>>(`${this.apiUrl}/${dni}`, chofer);
  }

  delete(dni: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${dni}`);
  }
}