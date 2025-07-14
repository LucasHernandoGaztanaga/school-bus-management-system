import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChoferService } from './chofer.service';
import { Chofer, CreateChoferRequest } from '../models/chofer.model';
import { ApiResponse } from '../models/chico.model';
import { environment } from '../../environments/environment';

describe('ChoferService', () => {
  let service: ChoferService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/choferes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChoferService]
    });
    service = TestBed.inject(ChoferService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all choferes', () => {
      const mockChoferes: Chofer[] = [
        { dni: '12345678', nombre: 'Juan', apellido: 'Perez', licencia: 'ABC123456' }
      ];
      const mockResponse: ApiResponse<Chofer[]> = {
        success: true,
        data: mockChoferes
      };

      service.getAll().subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockChoferes);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('create', () => {
    it('should create a new chofer', () => {
      const choferData: CreateChoferRequest = {
        dni: '12345678',
        nombre: 'Juan',
        apellido: 'Perez',
        licencia: 'ABC123456'
      };
      const createdChofer: Chofer = { ...choferData, _id: '507f1f77bcf86cd799439011' };
      const mockResponse: ApiResponse<Chofer> = {
        success: true,
        data: createdChofer
      };

      service.create(choferData).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(createdChofer);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(choferData);
      req.flush(mockResponse);
    });
  });

  describe('getByDni', () => {
    it('should return chofer by DNI', () => {
      const dni = '12345678';
      const mockChofer: Chofer = { 
        dni, 
        nombre: 'Juan', 
        apellido: 'Perez', 
        licencia: 'ABC123456' 
      };
      const mockResponse: ApiResponse<Chofer> = {
        success: true,
        data: mockChofer
      };

      service.getByDni(dni).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockChofer);
      });

      const req = httpMock.expectOne(`${apiUrl}/${dni}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should update chofer', () => {
      const dni = '12345678';
      const updateData = { nombre: 'Juan Carlos' };
      const updatedChofer: Chofer = { 
        dni, 
        nombre: 'Juan Carlos', 
        apellido: 'Perez', 
        licencia: 'ABC123456' 
      };
      const mockResponse: ApiResponse<Chofer> = {
        success: true,
        data: updatedChofer
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
    it('should delete chofer by DNI', () => {
      const dni = '12345678';
      const mockResponse: ApiResponse<void> = {
        success: true,
        message: 'Chofer deleted successfully'
      };

      service.delete(dni).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.message).toBe('Chofer deleted successfully');
      });

      const req = httpMock.expectOne(`${apiUrl}/${dni}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });
});