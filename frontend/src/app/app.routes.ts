import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/chicos', pathMatch: 'full' },
  { 
    path: 'chicos', 
    loadComponent: () => import('./components/chicos/chicos.component').then(m => m.ChicosComponent)
  },
  { 
    path: 'micros', 
    loadComponent: () => import('./components/micros/micros.component').then(m => m.MicrosComponent)
  },
  { 
    path: 'choferes', 
    loadComponent: () => import('./components/choferes/choferes.component').then(m => m.ChoferesComponent)
  },
  { path: '**', redirectTo: '/chicos' }
];