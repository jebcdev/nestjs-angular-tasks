import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Status, Task, TaskRequest } from '@/dashboard/interfaces';
import { toast } from 'ngx-sonner';
import { FormInputError } from '@/common/components';
import { Router, RouterLink } from '@angular/router';
import {
  DashboardStatusesService,
  DashboardTasksService,
} from '@/dashboard/services';
@Component({
  selector: 'dashboard-tasks-form',
  imports: [ReactiveFormsModule, FormInputError, RouterLink],
  templateUrl: './dashboard-tasks-form.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTasksForm {
  constructor() {
    effect(() => {
      if (this.task()?.id) {
        this.taskForm.patchValue({
          id: this.task()?.id,
          title: this.task()?.title,
          description: this.task()?.description,
          statusId: this.task()?.status?.id,
        });
      } else {
        this.taskForm.reset();
      }
    });
  }

  private router: Router = inject(Router);

  isReadonly = input.required<boolean>();
  task = input.required<Task>();
  message = computed<string>(() => {
    if (this.isReadonly()) {
      return 'Ver Tarea';
    }
    return this.task()?.id ? 'Editar Tarea' : 'Crear Tarea';
  });

  public statusesRs = inject(DashboardStatusesService).statusesRs;

  private tasksService: DashboardTasksService = inject(DashboardTasksService);

  private formBuilder: FormBuilder = inject(FormBuilder);

  public taskForm: FormGroup = this.formBuilder.group({
    id: [''],
    title: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
    ],
    description: ['', [Validators.maxLength(1000)]],
    statusId: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        ),
      ],
    ],
  });

  deleteTask(id: string): void {
    try {
      if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        this.tasksService.removeTask(id);
        toast.success('Tarea eliminada correctamente');
      }
    } catch (error) {
      toast.error('Error Al Borrar la Tarea', {
        description:
          'No se pudo eliminar la tarea. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }

  private createTask(taskData: TaskRequest): void {
    try {
      
      this.tasksService.createTask(taskData);
      toast.success('Tarea creada correctamente');
      this.router.navigate(['/dashboard/tasks']);
    } catch (error) {
      toast.error('Error al crear la tarea', {
        description:
          'No se pudo crear la tarea. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }

  private updateTask(id: string, taskData: TaskRequest): void {
    try {
      
      this.tasksService.updateTask(id, taskData);
      toast.success('Tarea actualizada correctamente');
      this.router.navigate(['/dashboard/tasks']);
    } catch (error) {
      toast.error('Error al actualizar la tarea', {
        description:
          'No se pudo actualizar la tarea. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }

  onSubmit(): void {
    try {
      if (this.taskForm.invalid) {
        this.taskForm.markAsDirty();
        this.taskForm.markAllAsTouched();
        toast.error('Formulario inválido', {
          description: 'Por favor, revisa los campos del formulario.',
        });
        return;
      }

      if (this.isReadonly()) {
        toast.info('El formulario está en modo de solo lectura');
        return;
      }

      const taskData: TaskRequest ={
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        statusId: this.taskForm.value.statusId,
      }
      if (!this.task().id || this.task().id === '') {
        this.createTask(taskData);
      } else {
        this.updateTask(this.task()?.id!, taskData);
      }
    } catch (error) {
      toast.error('Error al enviar el formulario', {
        description: 'Por favor, revisa los datos ingresados.',
      });
    }
  }
}
