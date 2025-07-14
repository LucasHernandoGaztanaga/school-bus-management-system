import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { ChicosComponent } from './chicos.component';
import { ChicoService } from '../../services/chico.service';
import { MicroService } from '../../services/micro.service';
import { Chico, ApiResponse } from '../../models/chico.model';

describe('ChicosComponent', () => {
  let component: ChicosComponent;
  let fixture: ComponentFixture<ChicosComponent>;
  let mockChicoService: jasmine.SpyObj<ChicoService>;
  let mockMicroService: jasmine.SpyObj<MicroService>;

  beforeEach(async () => {
    const chicoServiceSpy = jasmine.createSpyObj('ChicoService', [
      'getAll', 'create', 'update', 'delete', 'assignToMicro', 'removeFromMicro'
    ]);
    const microServiceSpy = jasmine.createSpyObj('MicroService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [
        ChicosComponent,
        ReactiveFormsModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ChicoService, useValue: chicoServiceSpy },
        { provide: MicroService, useValue: microServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChicosComponent);
    component = fixture.componentInstance;
    mockChicoService = TestBed.inject(ChicoService) as jasmine.SpyObj<ChicoService>;
    mockMicroService = TestBed.inject(MicroService) as jasmine.SpyObj<MicroService>;
  });

  beforeEach(() => {
    const mockChicosResponse: ApiResponse<Chico[]> = {
      success: true,
      data: []
    };
    const mockMicrosResponse = {
      success: true,
      data: []
    };

    mockChicoService.getAll.and.returnValue(of(mockChicosResponse));
    mockMicroService.getAll.and.returnValue(of(mockMicrosResponse));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    expect(component.chicoForm.get('dni')?.hasError('required')).toBeTruthy();
    expect(component.chicoForm.get('nombre')?.hasError('required')).toBeTruthy();
    expect(component.chicoForm.get('apellido')?.hasError('required')).toBeTruthy();
    expect(component.chicoForm.get('edad')?.hasError('required')).toBeTruthy();
  });

  it('should validate DNI format', () => {
    const dniControl = component.chicoForm.get('dni');
    
    dniControl?.setValue('123');
    expect(dniControl?.hasError('pattern')).toBeTruthy();
    
    dniControl?.setValue('12345678');
    expect(dniControl?.hasError('pattern')).toBeFalsy();
  });

  it('should validate age range', () => {
    const edadControl = component.chicoForm.get('edad');
    
    edadControl?.setValue(2);
    expect(edadControl?.hasError('min')).toBeTruthy();
    
    edadControl?.setValue(19);
    expect(edadControl?.hasError('max')).toBeTruthy();
    
    edadControl?.setValue(15);
    expect(edadControl?.valid).toBeTruthy();
  });

  it('should load chicos on init', () => {
    const mockChicos: Chico[] = [
      { dni: '12345678', nombre: 'Juan', apellido: 'Perez', edad: 15 }
    ];
    const mockResponse: ApiResponse<Chico[]> = {
      success: true,
      data: mockChicos
    };
    
    mockChicoService.getAll.and.returnValue(of(mockResponse));
    
    component.ngOnInit();
    
    expect(mockChicoService.getAll).toHaveBeenCalled();
    expect(component.chicos).toEqual(mockChicos);
  });

  it('should create chico when form is valid', () => {
    const chicoData = {
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

    component.chicoForm.patchValue(chicoData);
    mockChicoService.create.and.returnValue(of(mockResponse));
    mockChicoService.getAll.and.returnValue(of({ success: true, data: [createdChico] }));

    component.onSubmit();

    expect(mockChicoService.create).toHaveBeenCalledWith(chicoData);
  });

  it('should not submit when form is invalid', () => {
    component.chicoForm.patchValue({
      dni: '123',
      nombre: 'Juan',
      apellido: 'Perez',
      edad: 15
    });

    component.onSubmit();

    expect(mockChicoService.create).not.toHaveBeenCalled();
  });

  it('should set editing mode correctly', () => {
    const chico: Chico = {
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      edad: 15
    };

    component.editChico(chico);

    expect(component.editingChico).toEqual(chico);
    expect(component.chicoForm.get('dni')?.value).toBe(chico.dni);
    expect(component.chicoForm.get('nombre')?.value).toBe(chico.nombre);
  });

  it('should reset form correctly', () => {
    const chico: Chico = {
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      edad: 15
    };

    component.editChico(chico);
    component.resetForm();

    expect(component.editingChico).toBeNull();
    expect(component.chicoForm.get('dni')?.value).toBeNull();
  });

  it('should update chico when in editing mode', () => {
    const chico: Chico = {
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      edad: 15
    };
    const updateData = {
      dni: '12345678',
      nombre: 'Juan Carlos',
      apellido: 'Perez',
      edad: 16
    };
    const updatedChico: Chico = { ...updateData, _id: '507f1f77bcf86cd799439011' };
    const mockResponse: ApiResponse<Chico> = {
      success: true,
      data: updatedChico
    };

    component.editChico(chico);
    component.chicoForm.patchValue(updateData);
    mockChicoService.update.and.returnValue(of(mockResponse));
    mockChicoService.getAll.and.returnValue(of({ success: true, data: [updatedChico] }));

    component.onSubmit();

    expect(mockChicoService.update).toHaveBeenCalledWith(chico.dni, updateData);
  });

  it('should handle service errors gracefully', () => {
    mockChicoService.getAll.and.returnValue(throwError(() => new Error('Service error')));
    
    spyOn(component['snackBar'], 'open');
    
    component.loadChicos();
    
    expect(component['snackBar'].open).toHaveBeenCalledWith(
      'Error al cargar chicos',
      'Cerrar',
      { duration: 3000 }
    );
  });

  it('should delete chico after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Chico deleted successfully'
    };
    
    mockChicoService.delete.and.returnValue(of(mockResponse));
    mockChicoService.getAll.and.returnValue(of({ success: true, data: [] }));

    component.deleteChico('12345678');

    expect(mockChicoService.delete).toHaveBeenCalledWith('12345678');
  });

  it('should not delete chico if user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteChico('12345678');

    expect(mockChicoService.delete).not.toHaveBeenCalled();
  });
});