// Importación de decoradores y funciones principales de Angular
import {
  ChangeDetectionStrategy, // Estrategia de optimización de detección de cambios
  Component, // Decorador para definir componentes
  computed, // Función para crear propiedades computadas reactivas
  effect, // Función para ejecutar efectos cuando cambian señales
  inject, // Función para inyección de dependencias
  input, // Función para definir propiedades de entrada
} from '@angular/core';
// Importación de herramientas para formularios reactivos
import {
  FormBuilder, // Constructor de formularios con validaciones
  FormGroup, // Tipo que representa un grupo de controles
  ReactiveFormsModule, // Módulo para usar formularios reactivos
  Validators, // Conjunto de validadores predefinidos
} from '@angular/forms';
// Importación de interfaces y tipos del módulo dashboard
import { Status } from '@/dashboard/interfaces'; // Interfaz que define la estructura de un estado de tarea
// Importación de sistema de notificaciones
import { toast } from 'ngx-sonner'; // Librería para mostrar notificaciones al usuario
// Importación de componentes comunes
import { FormInputError } from '@/common/components'; // Componente para mostrar errores de validación
// Importación de herramientas de routing
import { Router, RouterLink } from '@angular/router'; // Router para navegación, RouterLink para enlaces
// Importación de servicios del dashboard
import { DashboardStatusesService } from '@/dashboard/services'; // Servicio para operaciones CRUD de estados

// Componente de formulario reutilizable para gestión de estados de tareas
@Component({
  selector: 'dashboard-statuses-form', // Selector HTML que identifica este componente
  imports: [ReactiveFormsModule, FormInputError, RouterLink], // Importaciones de componentes standalone necesarios
  templateUrl: './dashboard-statuses-form.html', // Ruta al template HTML externo
  styles: ``, // Estilos inline vacíos - usa template externo
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimización de detección de cambios
})
export class DashboardStatusesForm {
  // Constructor que configura efectos reactivos
  constructor() {
    // Efecto que actualiza el formulario cuando cambia el estado de entrada
    effect(() => {
      if (this.status()) {
        this.statusForm.patchValue({
          id: this.status()?.id || '', // ID del estado o cadena vacía por defecto
          name: this.status()?.name || '', // Nombre del estado o cadena vacía
          description: this.status()?.description || '', // Descripción del estado o cadena vacía
          color: this.status()?.color || '#000000', // Color del estado o negro por defecto
        });
      }
    });
  }

  // Inyección del servicio de estados para operaciones CRUD
  private statusesService: DashboardStatusesService = inject(
    DashboardStatusesService
  );
  // Inyección del router para navegación después de operaciones
  private router: Router = inject(Router);

  // Propiedades de entrada del componente
  isReadonly = input.required<boolean>(); // Determina si el formulario es de solo lectura
  status = input.required<Status>(); // Estado a mostrar/editar en el formulario

  // Propiedad computada que determina el mensaje del encabezado
  message = computed<string>(() => {
    if (this.isReadonly()) {
      return 'Ver Estado'; // Mensaje para modo de solo lectura
    }
    return this.status()?.id ? 'Editar Estado' : 'Crear Estado';
  });

  private formBuilder: FormBuilder = inject(FormBuilder);

  public statusForm: FormGroup = this.formBuilder.group({
    id: [''],
    name: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    description: ['', [Validators.maxLength(500)]],
    color: [
      '#000000',
      [
        Validators.required,
        Validators.pattern(/^#[0-9A-Fa-f]{6}$/),
        Validators.maxLength(7),
      ],
    ],
  });

  deleteStatus(id: string): void {
    try {
      if (confirm('¿Estás seguro de que quieres eliminar este estado?')) {
        this.statusesService.removeStatus(id);
        toast.success('Estado eliminado correctamente');
      }
    } catch (error) {
      toast.error('Error Al Borrar el Estado', {
        description:
          'No se pudo eliminar el estado. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }

  private createStatus(statusData: Status): void {
    try {
      delete statusData.id; // Remove id to avoid sending it in the update
      this.statusesService.createStatus(statusData);
      toast.success('Estado creado correctamente');
      this.router.navigate(['/dashboard/statuses']);
    } catch (error) {
      toast.error('Error al crear el estado', {
        description:
          'No se pudo crear el estado. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }

  private updateStatus(statusData: Status): void {
    try {
      const { id, ...statusWithoutId } = statusData;
      // return console.log({ statusId:statusData.id,statusData});
      this.statusesService.updateStatus(id!, statusWithoutId);
      toast.success('Estado actualizado correctamente');
      this.router.navigate(['/dashboard/statuses']);
    } catch (error) {
      toast.error('Error al actualizar el estado', {
        description:
          'No se pudo actualizar el estado. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }

  onSubmit(): void {
    try {
      if (this.statusForm.invalid) {
        this.statusForm.markAsDirty();
        this.statusForm.markAllAsTouched();
        toast.error('Formulario inválido', {
          description: 'Por favor, revisa los campos del formulario.',
        });
        return;
      }

      if (this.isReadonly()) {
        toast.info('El formulario está en modo de solo lectura');
        return;
      }

      const statusData: Status = this.statusForm.value as Status;
      if (!statusData.id || statusData.id === '') {
        this.createStatus(statusData);
      } else {
        this.updateStatus(statusData);
      }
    } catch (error) {
      toast.error('Error al enviar el formulario', {
        description: 'Por favor, revisa los datos ingresados.',
      });
    }
  }
}
