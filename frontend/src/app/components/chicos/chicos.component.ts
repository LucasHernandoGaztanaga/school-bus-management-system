import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { ChicoService } from '../../services/chico.service';
import { MicroService } from '../../services/micro.service';
import { Chico, CreateChicoRequest, UpdateChicoRequest } from '../../models/chico.model';
import { Micro } from '../../models/micro.model';

@Component({
  selector: 'app-chicos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <h1>Gestión de Chicos</h1>

      <!-- Formulario para crear/editar chico -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ editingChico ? 'Editar' : 'Nuevo' }} Chico</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="chicoForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field>
                <mat-label>DNI</mat-label>
                <input matInput formControlName="dni" [readonly]="editingChico">
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="nombre">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field>
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="apellido">
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Edad</mat-label>
                <input matInput type="number" formControlName="edad" min="3" max="18">
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!chicoForm.valid">
                {{ editingChico ? 'Actualizar' : 'Crear' }}
              </button>
              <button mat-button type="button" (click)="resetForm()" *ngIf="editingChico">
                Cancelar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de chicos -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Lista de Chicos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="chicos" class="full-width-table">
            <ng-container matColumnDef="dni">
              <th mat-header-cell *matHeaderCellDef>DNI</th>
              <td mat-cell *matCellDef="let chico">{{ chico.dni }}</td>
            </ng-container>

            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let chico">{{ chico.nombre }}</td>
            </ng-container>

            <ng-container matColumnDef="apellido">
              <th mat-header-cell *matHeaderCellDef>Apellido</th>
              <td mat-cell *matCellDef="let chico">{{ chico.apellido }}</td>
            </ng-container>

            <ng-container matColumnDef="edad">
              <th mat-header-cell *matHeaderCellDef>Edad</th>
              <td mat-cell *matCellDef="let chico">{{ chico.edad }}</td>
            </ng-container>

            <ng-container matColumnDef="micro">
              <th mat-header-cell *matHeaderCellDef>Micro Asignado</th>
              <td mat-cell *matCellDef="let chico">
                {{ chico.microInfo ? chico.microInfo.patente + ' - ' + chico.microInfo.modelo : 'Sin asignar' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let chico">
                <button mat-icon-button color="primary" (click)="editChico(chico)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteChico(chico.dni)">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="assignToMicro(chico)" *ngIf="!chico.microId">
                  <mat-icon>directions_bus</mat-icon>
                </button>
                <button mat-icon-button (click)="removeFromMicro(chico.dni)" *ngIf="chico.microId">
                  <mat-icon>remove_circle</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }

    .form-card, .table-card {
      margin-bottom: 20px;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .form-actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }

    .full-width-table {
      width: 100%;
    }

    h1 {
      margin-bottom: 20px;
      color: #1976d2;
    }
  `]
})
export class ChicosComponent implements OnInit {
  chicos: Chico[] = [];
  micros: Micro[] = [];
  chicoForm: FormGroup;
  editingChico: Chico | null = null;
  displayedColumns: string[] = ['dni', 'nombre', 'apellido', 'edad', 'micro', 'actions'];

  constructor(
    private chicoService: ChicoService,
    private microService: MicroService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.chicoForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      edad: ['', [Validators.required, Validators.min(3), Validators.max(18)]]
    });
  }

  ngOnInit(): void {
    this.loadChicos();
    this.loadMicros();
  }

  loadChicos(): void {
    this.chicoService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.chicos = response.data;
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar chicos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadMicros(): void {
    this.microService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.micros = response.data;
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar micros', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.chicoForm.valid) {
      const chicoData = this.chicoForm.value;

      if (this.editingChico) {
        this.updateChico(chicoData);
      } else {
        this.createChico(chicoData);
      }
    }
  }

  createChico(chicoData: CreateChicoRequest): void {
    this.chicoService.create(chicoData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Chico creado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadChicos();
          this.resetForm();
        }
      },
      error: (error) => {
        this.snackBar.open('Error al crear chico', 'Cerrar', { duration: 3000 });
      }
    });
  }

  updateChico(chicoData: UpdateChicoRequest): void {
    if (this.editingChico) {
      this.chicoService.update(this.editingChico.dni, chicoData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Chico actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadChicos();
            this.resetForm();
          }
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar chico', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  editChico(chico: Chico): void {
    this.editingChico = chico;
    this.chicoForm.patchValue({
      dni: chico.dni,
      nombre: chico.nombre,
      apellido: chico.apellido,
      edad: chico.edad
    });
  }

  deleteChico(dni: string): void {
    if (confirm('¿Está seguro de que desea eliminar este chico?')) {
      this.chicoService.delete(dni).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Chico eliminado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadChicos();
          }
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar chico', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  assignToMicro(chico: Chico): void {
    // Aquí implementarías un diálogo para seleccionar el micro
    const microPatente = prompt('Ingrese la patente del micro:');
    if (microPatente) {
      this.chicoService.assignToMicro(chico.dni, microPatente).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Chico asignado al micro exitosamente', 'Cerrar', { duration: 3000 });
            this.loadChicos();
          }
        },
        error: (error) => {
          this.snackBar.open('Error al asignar chico al micro', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  removeFromMicro(dni: string): void {
    this.chicoService.removeFromMicro(dni).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Chico removido del micro exitosamente', 'Cerrar', { duration: 3000 });
          this.loadChicos();
        }
      },
      error: (error) => {
        this.snackBar.open('Error al remover chico del micro', 'Cerrar', { duration: 3000 });
      }
    });
  }

  resetForm(): void {
    this.editingChico = null;
    this.chicoForm.reset();
  }
}