import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
/*  */
import { DashboardTasksService } from '@/dashboard/services';

import { Task } from '@/dashboard/interfaces';
import { TasksForm } from '@/tasks/components';

@Component({
  selector: 'statuses-create-page',
  imports: [TasksForm], 
  templateUrl: './tasks-create-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTasksCreatePage {
  private _router: Router = inject(Router);
  private _dashboardTasksService: DashboardTasksService = inject(
    DashboardTasksService
  );

  public emptyTask: Task = {
    title: '',
    description: '',
    user: null,
    status: null
  };

  onTaskCreated(): void {
    this._router.navigate(['/dashboard/statuses']);
  }
}

export default DashboardTasksCreatePage;
