import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

/*  */
import { AuthService } from '@/auth/services';
import { toast } from 'ngx-sonner';
import { FormInputError } from '@/common/components';

@Component({
  selector: 'auth-register-page',
  imports: [ReactiveFormsModule, RouterLink, FormInputError],
  templateUrl: './auth-register-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthRegisterPage {
  private _authService: AuthService =
    inject(AuthService); /* Inyecta el servicio de autenticación */
  private _formBuilder: FormBuilder =
    inject(FormBuilder); /* Inyecta el FormBuilder para crear formularios */

  private _router: Router =
    inject(Router); /* Inyecta el Router para navegación */

  public registerForm: FormGroup = this._formBuilder.group({
    /* Define el formulario de registro con validaciones */
    name: [
      '' /* Valor inicial vacío */,
      [
        Validators.required /* Campo obligatorio */,
        Validators.minLength(2) /* Mínimo 2 caracteres */,
        Validators.maxLength(100) /* Máximo 100 caracteres */,
      ],
    ] /* Campo nombre con validaciones de longitud y requerido */,
    email: [
      '' /* Valor inicial vacío */,
      [
        Validators.required /* Campo obligatorio */,
        Validators.email /* Validación de formato de email */,
        Validators.maxLength(150) /* Máximo 150 caracteres */,
      ],
    ] /* Campo email con validaciones de formato y longitud */,
    password: [
      '' /* Valor inicial vacío */,
      [
        Validators.required /* Campo obligatorio */,
        Validators.minLength(8) /* Mínimo 8 caracteres */,
        Validators.maxLength(50) /* Máximo 50 caracteres */,
        Validators.pattern(
          /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
        ) /* Patrón para mayúscula, minúscula y número/carácter especial */,
      ],
    ] /* Campo contraseña con validaciones de longitud y complejidad */,
  }); /* Formulario reactivo con validaciones completas */

  onSubmit(): void {
    try {
      if (this.registerForm.invalid) {
        toast.error('Formulario inválido. Por favor, corrige los errores.', {
          description: 'Asegúrate de que todos los campos sean válidos.',
        });
        this.registerForm.markAllAsTouched(); /* Marca todos los campos como tocados para mostrar errores */
        return; /* Detiene la ejecución si el formulario es inválido */
      }

      const registrationData =
        this.registerForm.value; /* Obtiene los datos del formulario */

      this._authService
        .register(
          registrationData
        ) /* Llama al servicio de autenticación para registrar el usuario */
        .subscribe({
          next: (res) => {
            toast.success('Usuario registrado exitosamente.', {
              description: 'Ahora puedes iniciar sesión con tus credenciales.',
            });
            this._router.navigate([
              '/',
            ]); /* Redirige al login después del registro */
          },
          error: (error) => {
            console.error('Registration error:', error);

            // Extraer mensaje específico del error
            let errorMessage =
              'Error al registrar el usuario. Por favor, inténtalo de nuevo.';
            let errorDescription =
              'Asegúrate de que los datos sean correctos y completos.';

            if (error?.error?.message) {
              errorMessage = error.error.message;
            } else if (error?.message) {
              errorMessage = error.message;
            }

            // Verificar si es un error de email duplicado
            if (
              errorMessage.includes('email') &&
              errorMessage.includes('uso')
            ) {
              errorDescription =
                'Este email ya está registrado. Intenta con otro email o inicia sesión.';
            }

            toast.error(errorMessage, {
              description: errorDescription,
            });
          },
        });
    } catch (error) {
      toast.error(
        'Error al registrar el usuario. Por favor, inténtalo de nuevo.',
        {
          description: 'Asegúrate de que los datos sean correctos y completos.',
        }
      );
    }
  }
}

export default AuthRegisterPage;
