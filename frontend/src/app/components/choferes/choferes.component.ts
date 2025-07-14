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

import { ChoferService } from '../../services/chofer.service';
import { Chofer, CreateChoferRequest, UpdateChoferRequest } from '../../models/chofer.model';

@Component({
  selector: 'app-choferes',
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
      <h1>Gestión de Choferes</h1>

      <!-- Formulario para crear/editar chofer -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ editingChofer ? 'Editar' : 'Nuevo' }} Chofer</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="choferForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field>
                <mat-label>DNI</mat-label>
                <input matInput formControlName="dni" [readonly]="editingChofer">
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
                <mat-label>Licencia</mat-label>
                <input matInput formControlName="licencia">
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!choferForm.valid">
                {{ editingChofer ? 'Actualizar' : 'Crear' }}
              </button>
              <button mat-button type="button" (click)="resetForm()" *ngIf="editingChofer">
                Cancelar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Tabla de choferes -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Lista de Choferes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="choferes" class="full-width-table">
            <ng-container matColumnDef="dni">
              <th mat-header-cell *matHeaderCellDef>DNI</th>
              <td mat-cell *matCellDef="let chofer">{{ chofer.dni }}</td>
            </ng-container>

            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let chofer">{{ chofer.nombre }}</td>
            </ng-container>

            <ng-container matColumnDef="apellido">
              <th mat-header-cell *matHeaderCellDef>Apellido</th>
              <td mat-cell *matCellDef="let chofer">{{ chofer.apellido }}</td>
            </ng-container>

            <ng-container matColumnDef="licencia">
              <th mat-header-cell *matHeaderCellDef>Licencia</th>
              <td mat-cell *matCellDef="let chofer">{{ chofer.licencia }}</td>
            </ng-container>

            <ng-container matColumnDef="micro">
              <th mat-header-cell *matHeaderCellDef>Micro Asignado</th>
              <td mat-cell *matCellDef="let chofer">
                {{ chofer.microInfo ? chofer.microInfo.patente + ' - ' + chofer.microInfo.modelo : 'Sin asignar' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let chofer">
                <button mat-icon-button color="primary" (click)="editChofer(chofer)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteChofer(chofer.dni)">
                  <mat-icon>delete</mat-icon>
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
export class ChoferesComponent implements OnInit {
  choferes: Chofer[] = [];
  choferForm: FormGroup;
  editingChofer: Chofer | null = null;
  displayedColumns: string[] = ['dni', 'nombre', 'apellido', 'licencia', 'micro', 'actions'];

  constructor(
    private choferService: ChoferService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.choferForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      licencia: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.loadChoferes();
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
    if (this.choferForm.valid) {
      const choferData = this.choferForm.value;
      choferData.licencia = choferData.licencia.toUpperCase();

      if (this.editingChofer) {
        this.updateChofer(choferData);
      } else {
        this.createChofer(choferData);
      }
    }
  }

  createChofer(choferData: CreateChoferRequest): void {
    this.choferService.create(choferData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Chofer creado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadChoferes();
          this.resetForm();
        }
      },
      error: (error) => {
        this.snackBar.open('Error al crear chofer', 'Cerrar', { duration: 3000 });
      }
    });
  }

  updateChofer(choferData: UpdateChoferRequest): void {
    if (this.editingChofer) {
      this.choferService.update(this.editingChofer.dni, choferData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Chofer actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadChoferes();
            this.resetForm();
          }
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar chofer', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  editChofer(chofer: Chofer): void {
    this.editingChofer = chofer;
    this.choferForm.patchValue({
      dni: chofer.dni,
      nombre: chofer.nombre,
      apellido: chofer.apellido,
      licencia: chofer.licencia
    });
  }

  deleteChofer(dni: string): void {
    if (confirm('¿Está seguro de que desea eliminar este chofer?')) {
      this.choferService.delete(dni).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Chofer eliminado exitosamente', 'Cerrar', { duration: 3000 });
            this.loadChoferes();
          }
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar chofer', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  resetForm(): void {
    this.editingChofer = null;
    this.choferForm.reset();
  }
}