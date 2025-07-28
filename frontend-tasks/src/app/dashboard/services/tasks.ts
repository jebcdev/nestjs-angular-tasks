import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay, Observable } from 'rxjs';
/*  */
import { environment } from '@env/environment';
import type { Task, TaskRequest } from '@/dashboard/interfaces';
import { toast } from 'ngx-sonner';

/*  */
const TASKS_API_URL = `${environment.apiUrl}/tasks`;
/*  */
@Injectable({
  providedIn: 'root',
})
export class DashboardTasksService {
  private http: HttpClient = inject(HttpClient);

  public tasksRs = rxResource({
    stream: () => this.getTasks(),
    defaultValue: [],
  });

  public getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(TASKS_API_URL).pipe(delay(500));
  }

  public getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${TASKS_API_URL}/${id}`).pipe(delay(500));
  }

  public createTask(task: TaskRequest) {
    return this.http
      .post<Task>(TASKS_API_URL, task)
      .pipe(delay(500))
      .subscribe({
        next: () => {
          this.tasksRs.reload();
        },
        error: (error) => {
          toast.error('Error al crear la tarea', {
            description:
              'No se pudo crear la tarea. Por favor, inténtalo de nuevo más tarde.',
          });
        },
      });
  }

  public updateTask(id: string, task: TaskRequest) {
    
    return this.http
      .patch<Task>(`${TASKS_API_URL}/${id}`, task)
      .pipe(delay(500))
      .subscribe({
        next: () => {
          this.tasksRs.reload();
        },
        error: (error) => {
          toast.error('Error al actualizar la tarea', {
            description:
              'No se pudo actualizar la tarea. Por favor, inténtalo de nuevo más tarde.',
          });
        },
      });
  }

  public removeTask(id: string) {
    return this.http
      .delete(`${TASKS_API_URL}/${id}`)

      .subscribe({
        next: () => {
          this.tasksRs.reload();
        },
        error: (error) => {
          toast.error('Error al eliminar la tarea', {
            description:
              'No se pudo eliminar la tarea. Por favor, inténtalo de nuevo más tarde.\n' +
              JSON.stringify(error),
          });
        },
      });
  }
}
