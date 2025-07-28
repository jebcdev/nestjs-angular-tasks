// Importación de funciones para inyección de dependencias
import { inject } from '@angular/core';
// Importación de tipos y servicios del router de Angular
import { CanMatchFn, Router } from '@angular/router';
// Importación del servicio de autenticación personalizado
import { AuthService } from '@/auth/services/';
// Importación de utilidad RxJS para convertir observables a promesas
import { firstValueFrom } from 'rxjs';
// Importación de enumeración de roles para verificación de permisos
import { Roles } from '@/common/enums';

// Guard de ruta que verifica si el usuario tiene permisos de administrador
export const IsAdminGuard: CanMatchFn = async () => {
  // Inyección del servicio de autenticación para verificar estado del usuario
  const authService: AuthService = inject(AuthService);
  // Inyección del router para navegación programática
  const router: Router = inject(Router);

  try {
    // Verificación del estado de autenticación con el servidor
    const isAuthenticated = await firstValueFrom(
      authService.checkAuthStatus() // Convierte observable a promesa
    );

    // Si el usuario no está autenticado, redirige al login
    if (!isAuthenticated) {
      router.navigate(['/auth/login']);
      return false; // Bloquea el acceso a la ruta
    }

    // Verificación si el usuario autenticado tiene rol de administrador
    const isAdmin = authService.isAdmin();

    // Si es administrador, permite el acceso
    if (isAdmin) {
      return true; // Permite acceso a rutas de administrador
    }

    // Usuario autenticado pero sin permisos de admin - redirige a inicio
    router.navigate(['/']);
    return false; // Bloquea acceso a rutas administrativas
  } catch (error) {
    // Manejo de errores durante la verificación
    console.error('Error in IsAdminGuard:', error);
    // En caso de error, redirige al login por seguridad
    router.navigate(['/auth/login']);
    return false; // Bloquea acceso por error de verificación
  }
};

export default IsAdminGuard;
