import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { toast } from 'ngx-sonner';
/*  */
import { Status } from '@/dashboard/interfaces';
import { DashboardStatusesService } from '@/dashboard/services';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dashboard-statuses-table',
  imports: [CommonModule,RouterLink],
  templateUrl: './dashboard-statuses-table.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStatusesTable {
  statuses = input.required<Status[]>(); // Required input for statuses
  private statusesService: DashboardStatusesService = inject(
    DashboardStatusesService
  );
  
  deleteStatus(id: string): void {
    try {
      if (confirm('¿Estás seguro de que quieres eliminar este estado?')) {
        this.statusesService.removeStatus(id);
        toast.success('Estado eliminado correctamente');
      }
    } catch (error) {
      toast.error('Error Al Borrar el Stado', {
        description:
          'No se pudo eliminar el estado. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  }
}

export default DashboardStatusesTable;
