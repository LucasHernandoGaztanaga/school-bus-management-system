import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>directions_bus</mat-icon>
      <span style="margin-left: 10px;">Sistema de Gestión de Micros Escolares</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/chicos">
        <mat-icon>people</mat-icon>
        Chicos
      </button>
      <button mat-button routerLink="/micros">
        <mat-icon>directions_bus</mat-icon>
        Micros
      </button>
      <button mat-button routerLink="/choferes">
        <mat-icon>person</mat-icon>
        Choferes
      </button>
    </mat-toolbar>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    button {
      margin-left: 10px;
    }
  `]
})
export class AppComponent {
  title = 'School Bus Management System';
}