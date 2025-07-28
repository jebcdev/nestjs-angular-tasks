import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { toast } from 'ngx-sonner';
/*  */
import { Task } from '@/dashboard/interfaces';
import { DashboardTasksService } from '@/dashboard/services';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tasks-table',
  imports: [CommonModule,RouterLink],
  templateUrl: './tasks-table.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksTable {
  tasks = input.required<Task[]>(); // Required input for tasks
  private tasksService: DashboardTasksService = inject(
    DashboardTasksService
  );
  
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
      console.warn(error)
    }
  }
}

export default  TasksTable;