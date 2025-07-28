import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    title: 'Dashboard' /* Titulo de la ruta */,
    path: '' /* Ruta base del dashboard */,
    loadComponent: () =>
      import(
        '@/dashboard/layout/dashboard-layout'
      ) /* Carga el componente del layout del dashboard */,
    children: [
      {
        title: 'Dashboard' /* Titulo de la ruta hija */,
        path: '' /* Ruta hija del dashboard */,
        loadComponent: () =>
          import(
            '@/dashboard/pages/index/dashboard-index-page'
          ) /* Carga el componente de la página de inicio del dashboard */,
      },
      {
        title: 'Users',
        path: 'users' /* Ruta hija para la gestión de usuarios */,
        loadComponent: () =>
          import(
            '@/dashboard/pages/users/index/dashboard-users-index-page'
          ) /* Carga el componente de la página de usuarios del dashboard */,
      },

      /* ******************************************************************************* */
      {
        title: 'Statuses',
        path: 'statuses' /* Ruta hija para la gestión de estados */,
        loadChildren: () =>
          import('@/dashboard/pages/statuses/dashboard-statuses.rotues'),
      },
      /* ******************************************************************************* */
      {
        title: 'Tasks',
        path:'tasks',
        loadChildren:()=>
          import(
            '@/dashboard/pages/tasks/dashboard-tasks.routes'
          )
      },
    ] /* Rutas hijas del dashboard */,
  },
];

export default dashboardRoutes;
