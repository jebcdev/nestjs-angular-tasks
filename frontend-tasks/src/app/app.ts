// Importación de decoradores y tipos principales de Angular
import { Component, signal, OnInit } from '@angular/core'; // Component para definir componentes, signal para reactividad, OnInit para manejo del ciclo de vida
import { RouterOutlet } from '@angular/router'; // Directiva que renderiza dinámicamente componentes basados en la ruta actual

// Importación de funcionalidad de Flowbite para componentes de interfaz de usuario
import { initFlowbite } from 'flowbite'; // Función que inicializa los componentes JavaScript interactivos de Flowbite

// Importación del componente de notificaciones toast
import { NgxSonnerToaster } from 'ngx-sonner'; // Componente para mostrar notificaciones emergentes tipo toast al usuario

// Componente raíz de la aplicación Angular - punto de entrada principal
@Component({
  selector: 'app-root', // Selector HTML que identifica este componente en el DOM (usado en index.html)
  imports: [RouterOutlet, NgxSonnerToaster], // Importación de componentes standalone requeridos para funcionalidad
  template: `
    <!-- Router outlet - renderiza el componente correspondiente a la ruta actual -->
    <router-outlet />

    <!-- Configuración global del sistema de notificaciones toast -->
    <ngx-sonner-toaster
      [expand]="true"
      position="top-right"
      richColors
      closeButton
    />
  `, // Template inline que define la estructura básica de la aplicación
})
export class App implements OnInit {
  // Método del ciclo de vida que se ejecuta después de la inicialización del componente
  ngOnInit(): void {
    initFlowbite(); // Inicializa los componentes JavaScript de Flowbite para interacciones de UI (dropdowns, modals, etc.)
  }
}
