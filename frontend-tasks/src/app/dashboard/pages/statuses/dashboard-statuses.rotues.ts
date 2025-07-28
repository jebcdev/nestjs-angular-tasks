import { Routes } from "@angular/router";

const dashboardStatusesRoutes: Routes = [
          {
        title: 'Statuses',
        path: '' /* Ruta hija para la gestión de estados */,
        loadComponent: () =>
          import(
            '@/dashboard/pages/statuses/index/dashboard-statuses-index-page'
          ) /* Carga el componente de la página de estados del dashboard */,
      },
      {
        title: 'Statuses Details',
        path: 'details/:id' /* Ruta hija para los detalles de un estado */,
        loadComponent: () =>
          import(
            '@/dashboard/pages/statuses/details/dashboard-statuses-details-page'
          ) /* Carga el componente de la página de detalles de un estado del dashboard */,
      },
      {
        title: 'Create Statuses',
        path: 'create' /* Ruta hija para crear un estado */,
        loadComponent: () =>
          import(
            '@/dashboard/pages/statuses/create/dashboard-statuses-create-page'
          ) /* Carga el componente de la página de creación de estados del dashboard */,
      },
      {
        title: 'Edit Statuses',
        path: 'edit/:id' /* Ruta hija para editar un estado */,
        loadComponent: () =>
          import(
            '@/dashboard/pages/statuses/edit/dashboard-statuses-edit-page'
          ) /* Carga el componente de la página de edición de estados del dashboard */,
      },
]

export default dashboardStatusesRoutes;