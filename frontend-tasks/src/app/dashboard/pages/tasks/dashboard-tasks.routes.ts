import { Routes } from '@angular/router';

export const dashboardTasksRoutes: Routes = [
  {
    title: 'Tasks',
    path: '' /* Ruta hija para la gestión de tareas */,
    loadComponent: () =>
      import(
        '@/dashboard/pages/tasks/index/dashboard-tasks-index-page'
      ) /* Carga el componente de la página de tareas del dashboard */,
  },
  {
    title: 'Create Tasks',
    path: 'create',
    loadComponent: () =>
      import('@/dashboard/pages/tasks/create/dashboard-tasks-create-page'),
  },
  {
    title:'Tasks Details',
    path:'details/:id',
    loadComponent: () =>
      import('@/dashboard/pages/tasks/details/dashboard-tasks-details-page'),
  
  }
  ,
  {
    title:'Edit Tasks',
    path:'edit/:id',
    loadComponent: () =>
      import('@/dashboard/pages/tasks/edit/dashboard-tasks-edit-page'),
  
  }
];

export default dashboardTasksRoutes;
