import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay, Observable } from 'rxjs';
/*  */
import { environment } from '@env/environment';
import type { Status } from '@/dashboard/interfaces';
import { toast } from 'ngx-sonner';
/*  */
const STATUSES_API_URL = `${environment.apiUrl}/tasks-statuses`;
/*  */
@Injectable({
  providedIn: 'root',
})
export class DashboardStatusesService {
  private http: HttpClient = inject(HttpClient);

  public statusesRs = rxResource({
    stream: () => this.getStatuses(),
    defaultValue: [],
  });

  public getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(STATUSES_API_URL).pipe(delay(500));
  }

  public getStatusById(id: string): Observable<Status> {
    return this.http.get<Status>(`${STATUSES_API_URL}/${id}`).pipe(delay(500));
  }

  public createStatus(status: Status) {
    return this.http
      .post<Status>(STATUSES_API_URL, status)
      .pipe(delay(500))
      .subscribe({
        next: () => {
          this.statusesRs.reload();
        },
        error: (error) => {
          toast.error('Error al crear el estado', {
            description:
              'No se pudo crear el estado. Por favor, inténtalo de nuevo más tarde.',
          });
        },
      });
  }

  public updateStatus(id:string,status: Status) {
    return this.http
      .patch<Status>(`${STATUSES_API_URL}/${id}`, status)
      .pipe(delay(500))
      .subscribe({
        next: () => {
          this.statusesRs.reload();
        },
        error: (error) => {
          toast.error('Error al actualizar el estado', {
            description:
              'No se pudo actualizar el estado. Por favor, inténtalo de nuevo más tarde.',
          });
        },
      });
  }

  public removeStatus(id: string) {
    return this.http
      .delete<void>(`${STATUSES_API_URL}/${id}`)
      .pipe(delay(500))
      .subscribe({
        next: () => {
          this.statusesRs.reload();
        },
        error: (error) => {
          toast.error('Error al eliminar el estado', {
            description:
              'No se pudo eliminar el estado. Por favor, inténtalo de nuevo más tarde.',
          });
        },
      });
  }
}
