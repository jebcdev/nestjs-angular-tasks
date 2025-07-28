// Importación de decoradores necesarios de Angular
import { ChangeDetectionStrategy, Component } from '@angular/core'; // ChangeDetectionStrategy para optimización, Component para definir componente

// Componente que muestra un mensaje cuando no hay datos para mostrar
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'is-empty', // Selector HTML simplificado para facilitar su uso
  imports: [], // Sin importaciones adicionales necesarias
  template: `
    <div
      role="alert"
      class="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-center p-10 m-10"
    >
      <span> No Hay Datos Para Mostrar </span>
    </div>
  `, // Template inline con estilos de Tailwind CSS para mostrar estado vacío
  changeDetection: ChangeDetectionStrategy.OnPush, // Estrategia de detección de cambios optimizada
})
export class IsEmptyComponent {}
