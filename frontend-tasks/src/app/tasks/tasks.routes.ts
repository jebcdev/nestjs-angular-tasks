import { Routes } from '@angular/router';

export const tasksRoutes: Routes = [
  {
    title: 'Tasks' /* Título de la página de diseño de tareas */,
    path: '' /* Ruta base para el diseño de tareas */,
    loadComponent: () =>
      import(
        './layout/front-tasks-layout'
      ) /* Carga perezosa del componente de diseño de tareas */,
    children: [
      {
        title: 'Tasks Index' /* Título de la página de índice de tareas */,
        path: '' /* Ruta para el índice de tareas */,
        loadComponent: () =>
          import(
            './pages/index/front-tasks-index-page'
          ) /* Carga perezosa del componente de página de índice de tareas */,
      },
      {
        title: 'Tasks Details' /* Título de la página de detalles de tareas */,
        path: 'details/:id' /* Ruta para los detalles de una tarea específica */,
        loadComponent: () =>
          import(
            './pages/details/tasks-details-page'
          ) /* Carga perezosa del componente de página de detalles de tareas */,
      },
      {
        title: 'Create Tasks' /* Título de la página de creación de tareas */,
        path: 'create' /* Ruta para crear una nueva tarea */,
        loadComponent: () =>
          import(
            './pages/create/tasks-create-page'
          ) /* Carga perezosa del componente de página de creación de tareas */,
      },
      {
        title: 'Edit Tasks' /* Título de la página de edición de tareas */,
        path: 'edit/:id' /* Ruta para editar una tarea específica */,
        loadComponent: () =>
          import(
            './pages/edit/tasks-edit-page'
          ) /* Carga perezosa del componente de página de edición de tareas */,
      }
    ],
  },
];

export default tasksRoutes; /* Exporta las rutas del módulo de tareas front para su uso en la configuración principal de rutas */
