import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChicoService } from './chico.service';
import { Chico, CreateChicoRequest, ApiResponse } from '../models/chico.model';
import { environment } from '../../environments/environment';

describe('ChicoService', () => {
  let service: ChicoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/chicos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChicoService]
    });
    service = TestBed.inject(ChicoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all chicos', () => {
      const mockChicos: Chico[] = [
        { dni: '12345678', nombre: 'Juan', apellido: 'Perez', edad: 15 }
      ];
      const mockResponse: ApiResponse<Chico[]> = {
        success: true,
        data: mockChicos
      };

      service.getAll().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockChicos);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('create', () => {
    it('should create a new chico', () => {
      const chicoData: CreateChicoRequest = {
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Perez',
        edad: 15
      };
      const createdChico: Chico = { ...chicoData, _id: '507f1f77bcf86cd799439011' };
      const mockResponse: ApiResponse<Chico> = {
        success: true,
        data: createdChico
      };

      service.create(chicoData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(createdChico);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(chicoData);
      req.flush(mockResponse);
    });
  });

  describe('getByDni', () => {
    it('should return chico by DNI', () => {
      const dni = '12345678';
      const mockChico: Chico = { dni, nombre: 'Juan', apellido: 'Perez', edad: 15 };
      const mockResponse: ApiResponse<Chico> = {
        success: true,
        data: mockChico
      };

      service.getByDni(dni).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockChico);
      });

      const req = httpMock.expectOne(`${apiUrl}/${dni}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should update chico', () => {
      const dni = '12345678';
      const updateData = { nombre: 'Juan Carlos' };
      const updatedChico: Chico = { 
        dni, 
        nombre: 'Juan Carlos', 
        apellido: 'Perez', 
        edad: 15 
      };
      const mockResponse: ApiResponse<Chico> = {
        success: true,
        data: updatedChico
      };

      service.update(dni, updateData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.nombre).toBe('Juan Carlos');
      });

      const req = httpMock.expectOne(`${apiUrl}/${dni}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete chico by DNI', () => {
      const dni = '12345678';
      const mockResponse: ApiResponse<void> = {
        success: true,
        message: 'Chico deleted successfully'
      };

      service.delete(dni).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.message).toBe('Chico deleted successfully');
      });

      const req = httpMock.expectOne(`${apiUrl}/${dni}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('assignToMicro', () => {
    it('should assign chico to micro', () => {
      const dni = '12345678';
      const microPatente = 'ABC123';
      const mockChico: Chico = { 
        dni, 
        nombre: 'Juan', 
        apellido: 'Perez', 
        edad: 15,
        microId: '507f1f77bcf86cd799439012'
      };
      const mockResponse: ApiResponse<Chico> = {
        success: true,
        data: mockChico
      };

      service.assignToMicro(dni, microPatente).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.microId).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/${dni}/assign-micro`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ microPatente });
      req.flush(mockResponse);
    });
  });

  describe('removeFromMicro', () => {
    it('should remove chico from micro', () => {
      const dni = '12345678';
      const mockChico: Chico = { 
        dni, 
        nombre: 'Juan', 
        apellido: 'Perez', 
        edad: 15,
        microId: null
      };
      const mockResponse: ApiResponse<Chico> = {
        success: true,
        data: mockChico
      };

      service.removeFromMicro(dni).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.microId).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${dni}/micro`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});