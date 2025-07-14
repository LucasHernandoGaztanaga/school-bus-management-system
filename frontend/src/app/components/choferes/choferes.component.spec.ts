import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { ChoferesComponent } from './choferes.component';
import { ChoferService } from '../../services/chofer.service';
import { Chofer, CreateChoferRequest } from '../../models/chofer.model';
import { ApiResponse } from '../../models/chico.model';

describe('ChoferesComponent', () => {
  let component: ChoferesComponent;
  let fixture: ComponentFixture<ChoferesComponent>;
  let mockChoferService: jasmine.SpyObj<ChoferService>;

  beforeEach(async () => {
    const choferServiceSpy = jasmine.createSpyObj('ChoferService', [
      'getAll', 'create', 'update', 'delete'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ChoferesComponent,
        ReactiveFormsModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ChoferService, useValue: choferServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChoferesComponent);
    component = fixture.componentInstance;
    mockChoferService = TestBed.inject(ChoferService) as jasmine.SpyObj<ChoferService>;
  });

  beforeEach(() => {
    const mockChoferesResponse: ApiResponse<Chofer[]> = {
      success: true,
      data: []
    };

    mockChoferService.getAll.and.returnValue(of(mockChoferesResponse));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct validators', () => {
    expect(component.choferForm.get('dni')?.hasError('required')).toBeTruthy();
    expect(component.choferForm.get('nombre')?.hasError('required')).toBeTruthy();
    expect(component.choferForm.get('apellido')?.hasError('required')).toBeTruthy();
    expect(component.choferForm.get('licencia')?.hasError('required')).toBeTruthy();
  });

  it('should validate DNI format', () => {
    const dniControl = component.choferForm.get('dni');
    
    dniControl?.setValue('123');
    expect(dniControl?.hasError('pattern')).toBeTruthy();
    
    dniControl?.setValue('12345678');
    expect(dniControl?.hasError('pattern')).toBeFalsy();
  });

  it('should validate license length', () => {
    const licenciaControl = component.choferForm.get('licencia');
    
    licenciaControl?.setValue('ABC');
    expect(licenciaControl?.hasError('minlength')).toBeTruthy();
    
    licenciaControl?.setValue('ABC123456');
    expect(licenciaControl?.valid).toBeTruthy();
  });

  it('should load choferes on init', () => {
    const mockChoferes: Chofer[] = [
      { dni: '12345678', nombre: 'Juan', apellido: 'Perez', licencia: 'ABC123456' }
    ];
    const mockResponse: ApiResponse<Chofer[]> = {
      success: true,
      data: mockChoferes
    };
    
    mockChoferService.getAll.and.returnValue(of(mockResponse));
    
    component.ngOnInit();
    
    expect(mockChoferService.getAll).toHaveBeenCalled();
    expect(component.choferes).toEqual(mockChoferes);
  });

  it('should create chofer when form is valid', () => {
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

    component.choferForm.patchValue(choferData);
    mockChoferService.create.and.returnValue(of(mockResponse));
    mockChoferService.getAll.and.returnValue(of({ success: true, data: [createdChofer] }));

    component.onSubmit();

    expect(mockChoferService.create).toHaveBeenCalledWith({ 
      ...choferData, 
      licencia: choferData.licencia.toUpperCase() 
    });
  });

  it('should not submit when form is invalid', () => {
    component.choferForm.patchValue({
      dni: '123',
      nombre: 'Juan',
      apellido: 'Perez',
      licencia: 'ABC123456'
    });

    component.onSubmit();

    expect(mockChoferService.create).not.toHaveBeenCalled();
  });

  it('should set editing mode correctly', () => {
    const chofer: Chofer = {
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      licencia: 'ABC123456'
    };

    component.editChofer(chofer);

    expect(component.editingChofer).toEqual(chofer);
    expect(component.choferForm.get('dni')?.value).toBe(chofer.dni);
    expect(component.choferForm.get('nombre')?.value).toBe(chofer.nombre);
  });

  it('should reset form correctly', () => {
    const chofer: Chofer = {
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      licencia: 'ABC123456'
    };

    component.editChofer(chofer);
    component.resetForm();

    expect(component.editingChofer).toBeNull();
    expect(component.choferForm.get('dni')?.value).toBeNull();
  });

  it('should update chofer when in editing mode', () => {
    const chofer: Chofer = {
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Perez',
      licencia: 'ABC123456'
    };
    const updateData = {
      dni: '12345678',
      nombre: 'Juan Carlos',
      apellido: 'Perez',
      licencia: 'ABC123456'
    };
    const updatedChofer: Chofer = { ...updateData, _id: '507f1f77bcf86cd799439011' };
    const mockResponse: ApiResponse<Chofer> = {
      success: true,
      data: updatedChofer
    };

    component.editChofer(chofer);
    component.choferForm.patchValue(updateData);
    mockChoferService.update.and.returnValue(of(mockResponse));
    mockChoferService.getAll.and.returnValue(of({ success: true, data: [updatedChofer] }));

    component.onSubmit();

    expect(mockChoferService.update).toHaveBeenCalledWith(chofer.dni, {
      ...updateData,
      licencia: updateData.licencia.toUpperCase()
    });
  });

  it('should handle service errors gracefully', () => {
    mockChoferService.getAll.and.returnValue(throwError(() => new Error('Service error')));
    
    spyOn(component['snackBar'], 'open');
    
    component.loadChoferes();
    
    expect(component['snackBar'].open).toHaveBeenCalledWith(
      'Error al cargar choferes',
      'Cerrar',
      { duration: 3000 }
    );
  });

  it('should delete chofer after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Chofer deleted successfully'
    };
    
    mockChoferService.delete.and.returnValue(of(mockResponse));
    mockChoferService.getAll.and.returnValue(of({ success: true, data: [] }));

    component.deleteChofer('12345678');

    expect(mockChoferService.delete).toHaveBeenCalledWith('12345678');
  });

  it('should not delete chofer if user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteChofer('12345678');

    expect(mockChoferService.delete).not.toHaveBeenCalled();
  });
});