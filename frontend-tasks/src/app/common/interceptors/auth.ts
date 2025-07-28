// Importación de tipos y funciones necesarias para interceptores HTTP
import { HttpHandlerFn, HttpRequest } from '@angular/common/http'; // Tipos para manejar peticiones HTTP y cadena de interceptores
import { inject } from '@angular/core'; // Función para inyección de dependencias
import { AuthService } from '@/auth/services'; // Servicio de autenticación para obtener tokens
import { environment } from '@env/environment'; // Variables de entorno para URLs de la API

// Interceptor de autenticación que agrega automáticamente tokens JWT a las peticiones HTTP
export function authInterceptor(
  req: HttpRequest<unknown>, // Petición HTTP entrante que será interceptada
  next: HttpHandlerFn // Función que continúa la cadena de interceptores
) {
  // Inyección del servicio de autenticación para acceder al token
  const authService = inject(AuthService);
  // Obtención del token JWT actual del usuario autenticado
  const token = authService.token();

  // Verificación si la petición es hacia endpoints de autenticación que no requieren token
  if (
    req.url.includes(`${environment.apiUrl}/auth/login`) || // Endpoint de inicio de sesión
    req.url.includes(`${environment.apiUrl}/auth/check-token`) // Endpoint de verificación de token
  ) {
    return next(req); // Continúa sin modificar la petición para endpoints de auth
  }

  // Si no hay token disponible, continúa con la petición original
  if (!token) {
    return next(req); // Envía la petición sin header de autorización
  }

  // Clonación de la petición original agregando el header de autorización con el token JWT
  const newReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`), // Agrega token en formato Bearer
  });

  // Continúa con la petición modificada que incluye el token de autorización
  return next(newReq);
}
