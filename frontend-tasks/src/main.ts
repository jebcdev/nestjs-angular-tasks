// Importación de la función para inicializar aplicaciones Angular
import { bootstrapApplication } from '@angular/platform-browser'; // Función para arrancar aplicaciones Angular standalone
// Importación de la configuración de la aplicación
import { appConfig } from './app/app.config'; // Configuración principal con providers y setup de la app
// Importación del componente raíz
import { App } from './app/app'; // Componente raíz que será montado en el DOM

// Inicialización y arranque de la aplicación Angular
bootstrapApplication(App, appConfig) // Monta el componente App con la configuración appConfig
  .catch((err) => console.error(err)); // Captura y muestra errores durante el arranque de la aplicación
