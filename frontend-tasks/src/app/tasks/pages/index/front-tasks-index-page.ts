import { IsEmptyComponent, IsErrorComponent, IsLoadingComponent } from '@/common/components/resource-status';
import { ChangeDetectionStrategy, Component, inject, ResourceRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import TasksTable from './components/table/tasks-table';
import { Task } from '@/dashboard/interfaces';
import { DashboardTasksService } from '@/dashboard/services';

@Component({
  selector: 'front-tasks-index-page',
  imports: [
      IsEmptyComponent,
    IsErrorComponent,
    IsLoadingComponent,
    TasksTable,
    RouterLink,
  ],
  templateUrl: './front-tasks-index-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrontTasksIndexPage {
  private tasksService: DashboardTasksService = inject(DashboardTasksService);

  tasksRs: ResourceRef<Task[]> = this.tasksService.tasksRs;
}


export default FrontTasksIndexPage;