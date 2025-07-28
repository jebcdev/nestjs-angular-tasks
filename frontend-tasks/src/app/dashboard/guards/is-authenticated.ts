// Importación de función para inyección de dependencias
import { inject } from '@angular/core';
// Importación de tipos del router para guards y navegación
import { CanMatchFn, Router } from '@angular/router'; // CanMatchFn define la función guard, Router para redirecciones
// Importación del servicio de autenticación
import { AuthService } from '@/auth/services/'; // Servicio que maneja estado de autenticación
// Importación de utilidad RxJS para convertir observables a promesas
import { firstValueFrom } from 'rxjs'; // Convierte observable a promesa para uso con async/await
// Importación de enumeración de roles (no utilizada en este guard)
import { Roles } from '@/common/enums'; // Enum de roles del sistema

// Guard que verifica si el usuario está autenticado antes de permitir acceso a rutas
export const IsAuthenticated: CanMatchFn = async () => {
  // Inyección del servicio de autenticación para verificar estado del usuario
  const authService: AuthService = inject(AuthService);
  // Inyección del router para navegación en caso de falta de autenticación
  const router: Router = inject(Router);

  try {
    // Verificación del estado de autenticación consultando al servidor
    const isAuthenticated = await firstValueFrom(
      authService.checkAuthStatus() // Convierte el observable de verificación a promesa
    );

    // Si el usuario no está autenticado, redirige al login
    if (!isAuthenticated) {
      router.navigate(['/auth/login']); // Redirección a página de inicio de sesión
      return false; // Bloquea el acceso a la ruta protegida
    }

    // Usuario autenticado - permite el acceso
    return true; // Permite acceso a rutas que requieren autenticación
  } catch (error) {
    console.error('Error in IsAuthenticated Guard:', error); // Log del error para debugging
    // En caso de error durante la verificación, redirige al login por seguridad
    router.navigate(['/auth/login']); // Redirección de seguridad en caso de error
    return false; // Bloquea acceso por medida de seguridad
  }
};

// Exportación por defecto para facilitar importación
export default IsAuthenticated;
