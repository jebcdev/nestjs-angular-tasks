// Importación de decoradores necesarios de Angular
import { ChangeDetectionStrategy, Component } from '@angular/core'; // ChangeDetectionStrategy para optimización, Component para definir componente

// Componente que muestra un indicador de carga mientras se obtienen datos
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'is-loading', // Selector HTML simplificado para facilitar su uso
  imports: [], // Sin importaciones adicionales necesarias
  template: `
    <div
      class="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-center p-10 m-10"
    >
      <div
        class="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-2"
      ></div>
      Cargando Datos ...
    </div>
  `, // Template inline con spinner animado usando Tailwind CSS
  changeDetection: ChangeDetectionStrategy.OnPush, // Estrategia de detección de cambios optimizada
})
export class IsLoadingComponent {}
