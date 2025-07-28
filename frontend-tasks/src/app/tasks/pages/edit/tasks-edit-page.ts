import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IsEmptyComponent, IsErrorComponent, IsLoadingComponent } from '@/common/components/resource-status';
/*  */
import { DashboardTasksService } from '@/dashboard/services';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { TasksForm } from '@/tasks/components';

@Component({
  selector: 'tasks-edit-page',
  imports: [IsEmptyComponent,
        IsErrorComponent,
        IsLoadingComponent,
      TasksForm],
  templateUrl: './tasks-edit-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksEditPage {
    private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _dashboardTasksService: DashboardTasksService = inject(
    DashboardTasksService
  );

  private tasksId = toSignal(
    this._activatedRoute.paramMap.pipe(map((params) => params.get('id')))
  );

  public tasksRs= rxResource({
    stream: () =>
      this._dashboardTasksService.getTaskById(this.tasksId()!),
    defaultValue: undefined,
  });
}

export default TasksEditPage;
