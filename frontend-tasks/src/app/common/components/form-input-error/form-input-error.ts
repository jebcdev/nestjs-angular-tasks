// Importación de decoradores y funciones necesarias de Angular
import { ChangeDetectionStrategy, Component, input } from '@angular/core'; // ChangeDetectionStrategy para optimización, Component para definir componente, input para propiedades de entrada

// Componente reutilizable para mostrar mensajes de error en formularios
@Component({
  selector: 'form-input-error', // Selector HTML personalizado para usar el componente
  imports: [], // Sin importaciones adicionales ya que es un componente simple
  templateUrl: './form-input-error.html', // Ruta al template HTML del componente
  styles: ``, // Estilos en línea vacíos (usa estilos globales o del template)
  changeDetection: ChangeDetectionStrategy.OnPush, // Estrategia de detección de cambios optimizada
})
export class FormInputError {
  message = input.required<string>(); // Propiedad de entrada requerida que contiene el mensaje de error a mostrar
}
