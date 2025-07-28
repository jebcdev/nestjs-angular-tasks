// Importación de decoradores y tipos principales de Angular
import { ChangeDetectionStrategy, Component } from '@angular/core'; // ChangeDetectionStrategy para optimizar rendimiento, Component para definir componentes
import { RouterOutlet } from '@angular/router'; // Directiva para renderizar componentes hijos basados en rutas

// Componente de layout principal para el módulo de autenticación
@Component({
  selector: 'auth-layout', // Selector HTML que identifica este componente
  imports: [RouterOutlet], // Importación de componentes standalone necesarios
  templateUrl: './auth-layout.html', // Ruta al template HTML externo
  styles: ``, // Estilos inline vacíos - se usa template externo
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimización de detección de cambios solo cuando cambian inputs o eventos
})
export class AuthLayout {
  // Componente simple sin lógica - solo proporciona estructura para páginas de auth
}

// Exportación por defecto para lazy loading
export default AuthLayout;
