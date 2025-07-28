import { DashboardTasksService } from '@/dashboard/services';
/*  */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ResourceRef,
} from '@angular/core';
import {
  IsEmptyComponent,
  IsErrorComponent,
  IsLoadingComponent,
} from '@/common/components/resource-status';
import DashboardTasksTable from './components/table/dashboard-tasks-table';
import { Task } from '@/dashboard/interfaces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dashboard-tasks-index-page',
  imports: [ 
    IsEmptyComponent,
    IsErrorComponent,
    IsLoadingComponent,
    DashboardTasksTable,
    RouterLink,
  ],
  templateUrl: './dashboard-tasks-index-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTasksIndexPage {
  private tasksService: DashboardTasksService = inject(DashboardTasksService);

  tasksRs: ResourceRef<Task[]> = this.tasksService.tasksRs;
}

export default DashboardTasksIndexPage;
