// Importación de decoradores necesarios de Angular
import { ChangeDetectionStrategy, Component } from '@angular/core'; // ChangeDetectionStrategy para optimización, Component para definir componente

// Componente que muestra un mensaje cuando ocurre un error al cargar datos
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'is-error', // Selector HTML simplificado para facilitar su uso
  imports: [], // Sin importaciones adicionales necesarias
  template: `
    <div
      role="alert"
      class="bg-red-50 border border-red-200 text-red-800 rounded-lg text-center p-10 m-10"
    >
      <span> Ups! Ocurrio Un Error Al Cargar Los Datos </span>
    </div>
  `, // Template inline con estilos de Tailwind CSS para mostrar estado de error

  changeDetection: ChangeDetectionStrategy.OnPush, // Estrategia de detección de cambios optimizada
})
export class IsErrorComponent {}
