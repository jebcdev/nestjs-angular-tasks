// Importación del tipo Routes para definir configuración de rutas en Angular
import { Routes } from '@angular/router'; // Tipo que define la estructura de configuración de rutas
// Importación de guards de autenticación y autorización
import { IsAdminGuard, IsAuthenticated } from '@/dashboard/guards/'; // Guards para proteger rutas según rol de usuario

// Configuración principal de rutas de la aplicación - define navegación y lazy loading
export const routes: Routes = [
  // Ruta protegida para usuarios autenticados - módulo de tareas frontend
  {
    canMatch: [IsAuthenticated], // Guard que verifica si el usuario está autenticado antes de cargar la ruta
    title: 'Tasks', // Título que aparece en la pestaña del navegador para páginas de tareas
    path: 'tasks', // Segmento de URL base para todas las funcionalidades de gestión de tareas
    loadChildren: () => import('@/tasks/tasks.routes'), // Carga perezosa del módulo de rutas de tareas desde el directorio tasks
  },
  // Ruta pública para autenticación - login y registro
  {
    title: 'Auth', // Título que aparece en la pestaña del navegador para páginas de autenticación
    path: 'auth', // Segmento de URL base para todas las funcionalidades de autenticación
    loadChildren: () => import('@/auth/auth.routes'), // Carga perezosa del módulo de rutas de autenticación (login, registro)
  },
  // Ruta protegida para administradores - panel de administración
  {
    canMatch: [IsAdminGuard], // Guard que verifica si el usuario es administrador antes de cargar la ruta
    title: 'Dashboard', // Título que aparece en la pestaña del navegador para páginas del dashboard
    path: 'dashboard', // Segmento de URL base para el panel de administración
    loadChildren: () => import('@/dashboard/dashboard.routes'), // Carga perezosa del módulo de rutas del dashboard administrativo
  },
  // Ruta comodín para manejar URLs no encontradas
  {
    title: 'Redirecting', // Título temporal durante la redirección
    path: '**', // Patrón que coincide con cualquier ruta no definida anteriormente
    redirectTo: 'tasks', // Redirige todas las rutas desconocidas a la página de tareas
    pathMatch: 'full', // Asegura que coincida con la ruta completa antes de redirigir
  },
];
