// Importación del tipo Routes para definir configuración de rutas
import { Routes } from '@angular/router';

// Configuración de rutas del módulo de autenticación
export const authRoutes: Routes = [
  {
    title: 'Auth', // Título de la página para las rutas de autenticación
    path: '', // Ruta base para todas las funcionalidades de autenticación
    loadComponent: () => import('@/auth/layout/auth-layout'), // Carga perezosa del componente de layout de autenticación
    children: [
      {
        title: 'Login', // Título de la página de inicio de sesión
        path: 'login', // Ruta para la página de inicio de sesión
        loadComponent: () => import('@/auth/pages/login/auth-login-page'), // Carga perezosa del componente de la página de inicio de sesión
      },
      {
        title: 'Register', // Título de la página de registro de usuarios
        path: 'register', // Ruta para la página de registro de nuevos usuarios
        loadComponent: () => import('@/auth/pages/register/auth-register-page'), // Carga perezosa del componente de la página de registro
      },
      {
        title: 'Redirecting...', // Título temporal durante la redirección
        path: '**', // Ruta comodín que captura cualquier ruta no definida dentro de auth
        redirectTo: 'login', // Redirecciona automáticamente a la página de inicio de sesión
      },
    ],
  },
];
// Exporta las rutas del módulo de autenticación para su uso en la configuración principal
export default authRoutes;
