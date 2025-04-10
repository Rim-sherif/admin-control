import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./log-in/log-in.component').then((m) => m.LogInComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: 'courses',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./dashboard/courses/courses.component').then(
                (m) => m.CoursesComponent
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./course-detail/course-detail.component').then(
                (m) => m.CourseDetailComponent
              ),
          },
        ],
      },

      {
        path: 'users',
        loadComponent: () =>
          import('./dashboard/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./dashboard/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'tickets',
        loadComponent: () =>
          import('./dashboard/tickets/tickets.component').then(
            (m) => m.TicketsComponent
          ),
      },
    ],
  },
];
