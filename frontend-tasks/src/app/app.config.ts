// Importación de tipos y funciones de configuración de Angular
import {
  ApplicationConfig, // Tipo para la configuración de la aplicación Angular
  provideBrowserGlobalErrorListeners, // Proveedor para manejo global de errores no capturados en el navegador
  provideZonelessChangeDetection, // Proveedor para detección de cambios sin Zone.js usando signals (Angular 18+)
} from '@angular/core';
// Importación de configuración del router Angular
import { provideRouter, withComponentInputBinding } from '@angular/router'; // Proveedor del router con binding automático de parámetros de ruta a inputs de componentes

// Importación de las rutas principales de la aplicación
import { routes } from './app.routes'; // Configuración de rutas definidas en el archivo app.routes.ts
// Importación de configuración del cliente HTTP
import {
  provideHttpClient, // Proveedor del cliente HTTP de Angular
  withFetch, // Habilitador de la API Fetch nativa del navegador en lugar de XMLHttpRequest
  withInterceptors, // Configurador para registrar interceptores HTTP personalizados
} from '@angular/common/http';
// Importación del interceptor de autenticación personalizado
import { authInterceptor } from './common/interceptors'; // Interceptor que automaticamente agrega tokens JWT a las peticiones HTTP

// Configuración principal de la aplicación Angular - define todos los providers necesarios
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), // Configura listeners globales para capturar errores no manejados del navegador
    provideZonelessChangeDetection(), // Habilita detección de cambios basada en signals sin usar Zone.js para mejor rendimiento
    provideRouter(routes, withComponentInputBinding()), // Configura el router con binding automático de parámetros de URL a inputs de componentes
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])), // Configura cliente HTTP con Fetch API nativa e interceptor de autenticación
  ],
};
