import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { MicrosComponent } from './micros.component';
import { MicroService } from '../../services/micro.service';
import { ChoferService } from '../../services/chofer.service';
import { Micro, CreateMicroRequest } from '../../models/micro.model';
import { ApiResponse } from '../../models/chico.model';

describe('MicrosComponent', () => {
  let component: MicrosComponent;
  let fixture: ComponentFixture<MicrosComponent>;
  let mockMicroService: jasmine.SpyObj<MicroService>;
  let mockChoferService: jasmine.SpyObj<ChoferService>;

  beforeEach(async () => {
    const microServiceSpy = jasmine.createSpyObj('MicroService', [
      'getAll', 'create', 'update', 'delete', 'assignChofer', 'removeChofer', 'getChicos'
    ]);
    const choferServiceSpy = jasmine.createSpyObj('ChoferService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [
        MicrosComponent,
        ReactiveFormsModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MicroService, useValue: microServiceSpy },
        { provide: ChoferService, useValue: choferServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MicrosComponent);
    component = fixture.componentInstance;
    mockMicroService = TestBed.inject(MicroService) as jasmine.SpyObj<MicroService>;
    mockChoferService = TestBed.inject(ChoferService) as jasmine.SpyObj<ChoferService>;
  });

  beforeEach(() => {
    const mockMicrosResponse: ApiResponse<Micro[]> = {
      success: true,
      data: []
    };
    const mockChoferesResponse = {
      success: true,
      data: []
    };

    mockMicroService.getAll.and.returnValue(of(mockMicrosResponse));
    mockChoferService.getAll.and.returnValue(of(mockChoferesResponse));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    expect(component.microForm.get('patente')?.hasError('required')).toBeTruthy();
    expect(component.microForm.get('modelo')?.hasError('required')).toBeTruthy();
    expect(component.microForm.get('capacidad')?.hasError('required')).toBeTruthy();
  });

  it('should validate patente format', () => {
    const patenteControl = component.microForm.get('patente');
    
    patenteControl?.setValue('123');
    expect(patenteControl?.hasError('pattern')).toBeTruthy();
    
    patenteControl?.setValue('ABC123');
    expect(patenteControl?.hasError('pattern')).toBeFalsy();
  });

  it('should validate capacity range', () => {
    const capacidadControl = component.microForm.get('capacidad');
    
    capacidadControl?.setValue(5);
    expect(capacidadControl?.hasError('min')).toBeTruthy();
    
    capacidadControl?.setValue(55);
    expect(capacidadControl?.hasError('max')).toBeTruthy();
    
    capacidadControl?.setValue(30);
    expect(capacidadControl?.valid).toBeTruthy();
  });

  it('should load micros on init', () => {
    const mockMicros: Micro[] = [
      { patente: 'ABC123', modelo: 'Mercedes', capacidad: 30 }
    ];
    const mockResponse: ApiResponse<Micro[]> = {
      success: true,
      data: mockMicros
    };
    
    mockMicroService.getAll.and.returnValue(of(mockResponse));
    
    component.ngOnInit();
    
    expect(mockMicroService.getAll).toHaveBeenCalled();
    expect(component.micros).toEqual(mockMicros);
  });

  it('should create micro when form is valid', () => {
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

    component.microForm.patchValue(microData);
    mockMicroService.create.and.returnValue(of(mockResponse));
    mockMicroService.getAll.and.returnValue(of({ success: true, data: [createdMicro] }));

    component.onSubmit();

    expect(mockMicroService.create).toHaveBeenCalledWith({ 
      ...microData, 
      patente: microData.patente.toUpperCase() 
    });
  });

  it('should not submit when form is invalid', () => {
    component.microForm.patchValue({
      patente: '123',
      modelo: 'Mercedes',
      capacidad: 30
    });

    component.onSubmit();

    expect(mockMicroService.create).not.toHaveBeenCalled();
  });

  it('should set editing mode correctly', () => {
    const micro: Micro = {
      patente: 'ABC123',
      modelo: 'Mercedes',
      capacidad: 30
    };

    component.editMicro(micro);

    expect(component.editingMicro).toEqual(micro);
    expect(component.microForm.get('patente')?.value).toBe(micro.patente);
    expect(component.microForm.get('modelo')?.value).toBe(micro.modelo);
  });

  it('should reset form correctly', () => {
    const micro: Micro = {
      patente: 'ABC123',
      modelo: 'Mercedes',
      capacidad: 30
    };

    component.editMicro(micro);
    component.resetForm();

    expect(component.editingMicro).toBeNull();
    expect(component.microForm.get('patente')?.value).toBeNull();
  });

  it('should handle service errors gracefully', () => {
    mockMicroService.getAll.and.returnValue(throwError(() => new Error('Service error')));
    
    spyOn(component['snackBar'], 'open');
    
    component.loadMicros();
    
    expect(component['snackBar'].open).toHaveBeenCalledWith(
      'Error al cargar micros',
      'Cerrar',
      { duration: 3000 }
    );
  });

  it('should delete micro after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Micro deleted successfully'
    };
    
    mockMicroService.delete.and.returnValue(of(mockResponse));
    mockMicroService.getAll.and.returnValue(of({ success: true, data: [] }));

    component.deleteMicro('ABC123');

    expect(mockMicroService.delete).toHaveBeenCalledWith('ABC123');
  });

  it('should not delete micro if user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteMicro('ABC123');

    expect(mockMicroService.delete).not.toHaveBeenCalled();
  });

  it('should assign chofer to micro', () => {
    spyOn(window, 'prompt').and.returnValue('12345678');
    const micro: Micro = {
      patente: 'ABC123',
      modelo: 'Mercedes',
      capacidad: 30
    };
    const mockResponse: ApiResponse<Micro> = {
      success: true,
      data: { ...micro, choferId: '507f1f77bcf86cd799439012' }
    };
    
    mockMicroService.assignChofer.and.returnValue(of(mockResponse));
    mockMicroService.getAll.and.returnValue(of({ success: true, data: [micro] }));

    component.assignChofer(micro);

    expect(mockMicroService.assignChofer).toHaveBeenCalledWith('ABC123', '12345678');
  });

  it('should get chicos from micro', () => {
    const micro: Micro = {
      patente: 'ABC123',
      modelo: 'Mercedes',
      capacidad: 30
    };
    const mockChicos = [
      { dni: '12345678', nombre: 'Juan', apellido: 'Perez', edad: 15 }
    ];
    const mockResponse = {
      success: true,
      data: mockChicos
    };
    
    mockMicroService.getChicos.and.returnValue(of(mockResponse));
    spyOn(component['snackBar'], 'open');

    component.viewChicos(micro);

    expect(mockMicroService.getChicos).toHaveBeenCalledWith('ABC123');
  });
});