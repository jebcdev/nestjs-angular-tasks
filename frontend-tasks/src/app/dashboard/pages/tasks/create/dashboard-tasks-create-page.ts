import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
/*  */
import { DashboardTasksService } from '@/dashboard/services';
import { DashboardTasksForm } from '@/dashboard/components';
import { Task } from '@/dashboard/interfaces';

@Component({
  selector: 'dashboard-statuses-create-page',
  imports: [DashboardTasksForm],
  templateUrl: './dashboard-tasks-create-page.html',
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
    this._router.navigate(['/dashboard/taks']);
  }
}

export default DashboardTasksCreatePage;
