import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // 💡 LAZY LOADING CONSTRUCT: Optimizes performance by importing the component on demand
    loadComponent: () => import('../monitor/monitor.component').then(m => m.MonitorComponent),
    title: 'PrivacyMonitor Control Panel'
  },
  {
    // Catch-all route to redirect any accidental broken URLs back to the main monitor board
    path: '**',
    redirectTo: ''
  }
];