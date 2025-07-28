// Importación del cliente HTTP de Angular para realizar peticiones a la API
import { HttpClient } from '@angular/common/http';
// Importación de decoradores y funciones principales de Angular
import {
  Injectable, // Decorador para hacer el servicio inyectable
  computed, // Función para crear propiedades computadas reactivas
  inject, // Función para inyección de dependencias
  signal, // Función para crear señales reactivas
} from '@angular/core';
// Importación de recurso reactivo para manejo de estado asíncrono
import { rxResource } from '@angular/core/rxjs-interop';

// Importación de variables de entorno para configuración de la API
import { environment } from '@env/environment.development';
// Importación de interfaces TypeScript para tipado fuerte
import type {
  User, // Interfaz del usuario
  LoginRequest, // Interfaz para datos de login
  RegisterRequest, // Interfaz para datos de registro
} from '../interfaces';

// Importación de tipo para estado de autenticación
import type { AuthStatus } from '../types/';
// Importación de enumeración de roles
import { Roles } from '@/common/enums';
// Importación de operadores y tipos de RxJS para programación reactiva
import {
  catchError, // Operador para capturar errores
  map, // Operador para transformar datos
  Observable, // Tipo para streams de datos
  of, // Función para crear observables simples
  throwError, // Función para propagar errores
} from 'rxjs';

// URL base de la API de autenticación construida desde variables de entorno
const AUTH_API_URL = `${environment.apiUrl}/auth`;

// Servicio de autenticación que maneja login, registro y estado de usuario
@Injectable({
  providedIn: 'root', // Proporcionado en la raíz - singleton en toda la aplicación
})
export class AuthService {
  // Inyección del cliente HTTP para realizar peticiones a la API
  private _http: HttpClient = inject(HttpClient);

  // Señales privadas para manejo del estado de autenticación
  private _user = signal<User | null>(null); // Usuario actualmente logueado
  private _authStatus = signal<AuthStatus>('unknown'); // Estado de autenticación actual
  private _token = signal<string | null>(localStorage.getItem('token')); // Token JWT almacenado

  // Propiedades computadas públicas para acceso reactivo al estado
  public user = computed<User | null>(() => this._user()); // Usuario actual de solo lectura

  // Estado de autenticación computado basado en señales internas
  public authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'unknown') return 'unknown'; // Estado inicial
    if (this._user()) return 'authenticated'; // Hay usuario = autenticado
    return 'unauthenticated'; // No hay usuario = no autenticado
  });

  // Token JWT actual de solo lectura
  public token = computed<string | null>(() => this._token());

  // Verifica si el usuario actual tiene permisos de administrador
  public isAdmin = computed<boolean>(() => {
    const user = this._user(); // Obtiene el usuario actual
    if (!user) return false; // Sin usuario no puede ser admin
    return user.roles.includes(Roles.admin); // Verifica si tiene rol de admin
  });

  // Método para cerrar sesión y limpiar todo el estado de autenticación
  logout() {
    this._user.set(null); // Limpia el usuario en memoria
    this._token.set(null); // Limpia el token en memoria
    this._authStatus.set('unauthenticated'); // Establece estado como no autenticado
    localStorage.removeItem('token'); // Remueve token del almacenamiento local
  }

  // Método privado para manejar autenticación exitosa
  private handleAuthSuccess(res: User) {
    this._user.set(res); // Establece el usuario en el estado
    this._token.set(res.token ?? null); // Establece el token con fallback a null
    this._authStatus.set('authenticated'); // Marca como autenticado
    localStorage.setItem('token', res.token ?? ''); // Persiste token en localStorage
    return true; // Retorna éxito para la cadena de observables
  }

  // Método privado para manejar errores de autenticación
  private handleAuthError(error: unknown) {
    console.error('AuthService Error:', error); // Log del error para debugging
    this.logout(); // Limpia el estado de autenticación
    return throwError(() => error); // Propaga el error para manejo en componentes
  }

  // Verifica el estado de autenticación actual contra el servidor
  public checkAuthStatus(): Observable<Boolean> {
    try {
      // Obtiene el token del almacenamiento local
      const token: string | null = localStorage.getItem('token');

      // Si no hay token, establece como no autenticado
      if (!token) {
        this._authStatus.set('unauthenticated');
        this._user.set(null);
        return of(false); // Retorna observable con false
      }

      // Verifica el token con el servidor
      return this._http
        .post<User>(
          `${AUTH_API_URL}/check-token`, // Endpoint de verificación de token
          {}, // Cuerpo vacío
          {
            headers: {
              Authorization: `Bearer ${token}`, // Header con token Bearer
            },
          }
        )
        .pipe(
          map((res) => this.handleAuthSuccess(res)), // Maneja respuesta exitosa
          catchError((error) => this.handleAuthError(error)) // Maneja errores
        );
    } catch (error) {
      // Captura errores síncronos y los convierte en error personalizado
      throw new Error('Error checking authentication status');
    }
  }

  // Recurso reactivo para verificación de estado de autenticación
  public checkAuthStatusRs = rxResource({
    stream: () => this.checkAuthStatus(), // Stream que ejecuta la verificación
    defaultValue: false, // Valor por defecto hasta que se resuelva
  });

  // Registra un nuevo usuario en el sistema
  public register(registrationData: RegisterRequest): Observable<boolean> {
    try {
      return this._http
        .post<User>(`${AUTH_API_URL}/register`, registrationData) // POST al endpoint de registro
        .pipe(
          map((res) => this.handleAuthSuccess(res)), // Maneja registro exitoso
          catchError((error: unknown) => this.handleAuthError(error)) // Maneja errores de registro
        );
    } catch (error) {
      // Captura errores síncronos durante el registro
      throw new Error('Error during registration');
    }
  }

  // Inicia sesión con credenciales de usuario
  public login(data: LoginRequest): Observable<boolean> {
    return this._http
      .post<User>(`${AUTH_API_URL}/login`, data) // POST al endpoint de login
      .pipe(
        map((res) => this.handleAuthSuccess(res)), // Maneja login exitoso
        catchError((error: unknown) => this.handleAuthError(error)) // Maneja errores de login
      );
  }
}
