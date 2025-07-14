import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MicroService } from './micro.service';
import { Micro, CreateMicroRequest } from '../models/micro.model';
import { ApiResponse } from '../models/chico.model';
import { environment } from '../../environments/environment';

describe('MicroService', () => {
  let service: MicroService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/micros`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MicroService]
    });
    service = TestBed.inject(MicroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all micros', () => {
      const mockMicros: Micro[] = [
        { patente: 'ABC123', modelo: 'Mercedes', capacidad: 30 }
      ];
      const mockResponse: ApiResponse<Micro[]> = {
        success: true,
        data: mockMicros
      };

      service.getAll().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockMicros);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('create', () => {
    it('should create a new micro', () => {
      const microData: CreateMicroRequest = {
        patente: 'ABC123',
        modelo: 'Mercedes',
        capacidad: 30
      };
      const createdMicro: Micro = { ...microData, _id: '507f1f77bcf86cd799439011' };
      const mockResponse: ApiResponse<Micro> = {
        success: true,
        data: createdMicro
      };

      service.create(microData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(createdMicro);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(microData);
      req.flush(mockResponse);
    });
  });

  describe('getByPatente', () => {
    it('should return micro by patente', () => {
      const patente = 'ABC123';
      const mockMicro: Micro = { patente, modelo: 'Mercedes', capacidad: 30 };
      const mockResponse: ApiResponse<Micro> = {
        success: true,
        data: mockMicro
      };

      service.getByPatente(patente).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockMicro);
      });

      const req = httpMock.expectOne(`${apiUrl}/${patente}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should update micro', () => {
      const patente = 'ABC123';
      const updateData = { modelo: 'Mercedes Benz' };
      const updatedMicro: Micro = { 
        patente, 
        modelo: 'Mercedes Benz', 
        capacidad: 30 
      };
      const mockResponse: ApiResponse<Micro> = {
        success: true,
        data: updatedMicro
      };

      service.update(patente, updateData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.modelo).toBe('Mercedes Benz');
      });

      const req = httpMock.expectOne(`${apiUrl}/${patente}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete micro by patente', () => {
      const patente = 'ABC123';
      const mockResponse: ApiResponse<void> = {
        success: true,
        message: 'Micro deleted successfully'
      };

      service.delete(patente).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.message).toBe('Micro deleted successfully');
      });

      const req = httpMock.expectOne(`${apiUrl}/${patente}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('assignChofer', () => {
    it('should assign chofer to micro', () => {
      const patente = 'ABC123';
      const choferDni = '12345678';
      const mockMicro: Micro = {
        patente,
        modelo: 'Mercedes',
        capacidad: 30,
        choferId: '507f1f77bcf86cd799439012'
      };
      const mockResponse: ApiResponse<Micro> = {
        success: true,
        data: mockMicro
      };

      service.assignChofer(patente, choferDni).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.choferId).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/${patente}/assign-chofer`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ choferDni });
      req.flush(mockResponse);
    });
  });

  describe('removeChofer', () => {
    it('should remove chofer from micro', () => {
      const patente = 'ABC123';
      const mockMicro: Micro = {
        patente,
        modelo: 'Mercedes',
        capacidad: 30,
        choferId: null
      };
      const mockResponse: ApiResponse<Micro> = {
        success: true,
        data: mockMicro
      };

      service.removeChofer(patente).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.choferId).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${patente}/chofer`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('getChicos', () => {
    it('should return chicos assigned to micro', () => {
      const patente = 'ABC123';
      const mockChicos = [
        { dni: '12345678', nombre: 'Juan', apellido: 'Perez', edad: 15 }
      ];
      const mockResponse = {
        success: true,
        data: mockChicos
      };

      service.getChicos(patente).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockChicos);
      });

      const req = httpMock.expectOne(`${apiUrl}/${patente}/chicos`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});