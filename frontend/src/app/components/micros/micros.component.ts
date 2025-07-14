import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { MicroService } from '../../services/micro.service';
import { ChoferService } from '../../services/chofer.service';
import { Micro, CreateMicroRequest, UpdateMicroRequest } from '../../models/micro.model';
import { Chofer } from '../../models/chofer.model';

@Component({
  selector: 'app-micros',
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
    MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <h1>Gestión de Micros</h1>

      <!-- Formulario para crear/editar micro -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ editingMicro ? 'Editar' : 'Nuevo' }} Micro</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="microForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field>
                <mat-label>Patente</mat-label>
                <input matInput formControlName="patente" [readonly]="!!editingMicro" placeholder="ABC123">
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Modelo</mat-label>
                <input matInput formControlName="modelo">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field>
                <mat-label>Capacidad</mat-label>
                <input matInput type="number" formControlName="capacidad" min="10" max="50">
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!microForm.valid">
                {{ editingMicro ? 'Actualizar' : 'Crear' }}
              </button>
              <button mat-button type="button" (click)="resetForm()" *ngIf="editingMicro">
                Cancelar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de micros -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Lista de Micros</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="micros" class="full-width-table">
            <ng-container matColumnDef="patente">
              <th mat-header-cell *matHeaderCellDef>Patente</th>
              <td mat-cell *matCellDef="let micro">{{ micro.patente }}</td>
            </ng-container>

            <ng-container matColumnDef="modelo">
              <th mat-header-cell *matHeaderCellDef>Modelo</th>
              <td mat-cell *matCellDef="let micro">{{ micro.modelo }}</td>
            </ng-container>

            <ng-container matColumnDef="capacidad">
              <th mat-header-cell *matHeaderCellDef>Capacidad</th>
              <td mat-cell *matCellDef="let micro">{{ micro.capacidad }}</td>
            </ng-container>

            <ng-container matColumnDef="chofer">
              <th mat-header-cell *matHeaderCellDef>Chofer Asignado</th>
              <td mat-cell *matCellDef="let micro">
                {{ micro.choferInfo ? micro.choferInfo.nombre + ' ' + micro.choferInfo.apellido : 'Sin asignar' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let micro">
                <button mat-icon-button color="primary" (click)="editMicro(micro)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteMicro(micro.patente)">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="assignChofer(micro)" *ngIf="!micro.choferId">
                  <mat-icon>person_add</mat-icon>
                </button>
                <button mat-icon-button (click)="removeChofer(micro.patente)" *ngIf="micro.choferId">
                  <mat-icon>person_remove</mat-icon>
                </button>
                <button mat-icon-button (click)="viewChicos(micro)">
                  <mat-icon>people</mat-icon>
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
export class MicrosComponent implements OnInit {
  micros: Micro[] = [];
  choferes: Chofer[] = [];
  microForm: FormGroup;
  editingMicro: Micro | null = null;
  displayedColumns: string[] = ['patente', 'modelo', 'capacidad', 'chofer', 'actions'];

  constructor(
    private microService: MicroService,
    private choferService: ChoferService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.microForm = this.fb.group({
      patente: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9]{3,4}$/)]],
      modelo: ['', [Validators.required, Validators.minLength(2)]],
      capacidad: ['', [Validators.required, Validators.min(10), Validators.max(50)]]
    });
  }

  ngOnInit(): void {
    this.loadMicros();
    this.loadChoferes();
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

  loadChoferes(): void {
    this.choferService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.choferes = response.data;
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cargar choferes', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.microForm.valid) {
      const microData = this.microForm.value;
      microData.patente = microData.patente.toUpperCase();

      if (this.editingMicro) {
        this.updateMicro(microData);
      } else {
        this.createMicro(microData);
      }
    }
  }

  createMicro(microData: CreateMicroRequest): void {
    this.microService.create(microData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Micro creado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadMicros();
          this.resetForm();
        }
      },
      error: (error) => {
        this.snackBar.open('Error al crear micro', 'Cerrar', { duration: 3000 });
      }
    });
  }

  updateMicro(microData: UpdateMicroRequest): void {
    if (this.editingMicro) {
      this.microService.update(this.editingMicro.patente, microData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Micro actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadMicros();
            this.resetForm();
          }
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar micro', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  editMicro(micro: Micro): void {
    this.editingMicro = micro;
    this.microForm.patchValue({
      patente: micro.patente,
      modelo: micro.modelo,
      capacidad: micro.capacidad
    });
  }

  deleteMicro(patente: string): void {
    if (confirm('¿Está seguro de que desea eliminar este micro?')) {
      this.microService.delete(patente).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Micro eliminado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadMicros();
          }
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar micro', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  assignChofer(micro: Micro): void {
    const choferDni = prompt('Ingrese el DNI del chofer:');
    if (choferDni) {
      this.microService.assignChofer(micro.patente, choferDni).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Chofer asignado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadMicros();
          }
        },
        error: (error) => {
          this.snackBar.open('Error al asignar chofer', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  removeChofer(patente: string): void {
    this.microService.removeChofer(patente).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Chofer removido exitosamente', 'Cerrar', { duration: 3000 });
          this.loadMicros();
        }
      },
      error: (error) => {
        this.snackBar.open('Error al remover chofer', 'Cerrar', { duration: 3000 });
      }
    });
  }

  viewChicos(micro: Micro): void {
    this.microService.getChicos(micro.patente).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const chicosNames = response.data.map(c => `${c.nombre} ${c.apellido}`).join(', ');
          const message = chicosNames || 'No hay chicos asignados a este micro';
          this.snackBar.open(`Chicos en ${micro.patente}: ${message}`, 'Cerrar', { duration: 5000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Error al obtener chicos del micro', 'Cerrar', { duration: 3000 });
      }
    });
  }

  resetForm(): void {
    this.editingMicro = null;
    this.microForm.reset();
  }
}