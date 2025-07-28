// Importación del servicio de autenticación personalizado
import { AuthService } from '@/auth/services'; // Servicio para manejar login, registro y estado de usuario
// Importación de componente común para mostrar errores de formulario
import { FormInputError } from '@/common/components'; // Componente reutilizable para mostrar errores de validación
// Importación de decoradores y tipos principales de Angular
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'; // Component para definir componentes, inject para DI, ChangeDetectionStrategy para optimización
// Importación de herramientas para formularios reactivos
import {
  FormBuilder, // Constructor de formularios con validaciones
  FormGroup, // Tipo que representa un grupo de controles de formulario
  ReactiveFormsModule, // Módulo para usar formularios reactivos
  Validators, // Conjunto de validadores predefinidos
} from '@angular/forms';
// Importación de herramientas de routing
import { Router, RouterLink } from '@angular/router'; // Router para navegación programática, RouterLink para enlaces
// Importación de sistema de notificaciones
import { toast } from 'ngx-sonner'; // Librería para mostrar notificaciones toast al usuario

// Componente de página para inicio de sesión de usuarios
@Component({
  selector: 'auth-login-page', // Selector HTML que identifica este componente
  imports: [ReactiveFormsModule, RouterLink, FormInputError], // Importación de componentes standalone necesarios
  templateUrl: './auth-login-page.html', // Ruta al template HTML externo
  styles: ``, // Estilos inline vacíos - se usa template externo
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimización de detección de cambios
})
export class AuthLoginPage {
  // Inyección del servicio de autenticación para manejar el login
  private _authService: AuthService = inject(AuthService); // Servicio que maneja autenticación y estado del usuario
  // Inyección del FormBuilder para construir formularios reactivos
  private _formBuilder: FormBuilder = inject(FormBuilder); // Constructor de formularios con validaciones integradas
  // Inyección del Router para navegación después del login exitoso
  private _router: Router = inject(Router); // Servicio de routing para redireccionar usuarios

  // Formulario reactivo para capturar datos de inicio de sesión
  public loginForm: FormGroup = this._formBuilder.group({
    // Campo email con validaciones de formato y longitud
    email: [
      '', // Valor inicial vacío
      [
        Validators.required, // Campo obligatorio - no puede estar vacío
        Validators.email, // Validación de formato de email válido
        Validators.maxLength(150), // Máximo 150 caracteres permitidos
      ],
    ], // Control para dirección de correo electrónico del usuario
    // Campo contraseña con validaciones de seguridad
    password: [
      '', // Valor inicial vacío
      [
        Validators.required, // Campo obligatorio - no puede estar vacío
        Validators.minLength(8), // Mínimo 8 caracteres para seguridad
        Validators.maxLength(50), // Máximo 50 caracteres
        Validators.pattern(
          /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
        ), // Patrón regex que requiere: mayúscula, minúscula y número/carácter especial
      ],
    ], // Control para contraseña del usuario con validaciones de complejidad
  }); // Formulario reactivo completo con todas las validaciones de seguridad

  // Método que maneja el envío del formulario de inicio de sesión
  onSubmit(): void {
    try {
      // Validación del formulario antes de procesar
      if (this.loginForm.invalid) {
        toast.error('Formulario inválido. Por favor, corrige los errores.', {
          description: 'Asegúrate de que todos los campos sean válidos.',
        });
        this.loginForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores de validación
        return; // Termina la ejecución si hay errores de validación
      }

      // Obtiene los datos validados del formulario
      const loginData = this.loginForm.value; // Extrae email y password del formulario

      // Ejecuta el proceso de inicio de sesión a través del servicio
      this._authService
        .login(loginData) // Llama al servicio de autenticación con los datos del formulario
        .subscribe({
          // Manejo de respuesta exitosa del login
          next: (res) => {
            toast.success('Inicio de sesión exitoso. Bienvenido!', {
              description: 'Bienvenido Nuevamente a la aplicación.',
            });
            // Redirección basada en el rol del usuario
            if (this._authService.isAdmin())
              this._router.navigate(['/dashboard/']); // Admin va al dashboard
            else this._router.navigate(['/']); // Usuario normal va a la página principal
          },
          // Manejo de errores durante el login
          error: (error) => {
            toast.error(
              'Error al iniciar sesión. Por favor, inténtalo de nuevo.',
              {
                description: 'Asegúrate de que los datos sean correctos.',
              }
            );
          },
        });
    } catch (error) {
      // Manejo de errores síncronos no anticipados
      toast.error('Error al iniciar sesión. Por favor, inténtalo de nuevo.', {
        description: 'Asegúrate de que los datos sean correctos y completos.',
      });
    }
  }
}

// Exportación por defecto para lazy loading
export default AuthLoginPage;
