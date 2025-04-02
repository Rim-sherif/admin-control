import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./log-in/log-in.component').then(m => m.LogInComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'courses',
        loadComponent: () => import('./dashboard/courses/courses.component').then(m => m.CoursesComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./dashboard/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./dashboard/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  }
];
