import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
/*  */
import { DashboardTasksService } from '@/dashboard/services';
import {
  IsEmptyComponent,
  IsErrorComponent,
  IsLoadingComponent,
} from '@/common/components/resource-status';
import { TasksForm } from '@/tasks/components';

@Component({
  selector: 'tasks-details-page',
  imports: [IsEmptyComponent, IsErrorComponent, IsLoadingComponent, TasksForm],
  templateUrl: './tasks-details-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksDetailsPage {
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _dashboardTasksService: DashboardTasksService = inject(
    DashboardTasksService
  );

  private taskId = toSignal(
    this._activatedRoute.paramMap.pipe(map((params) => params.get('id')))
  );

  public taskRs = rxResource({
    stream: () => this._dashboardTasksService.getTaskById(this.taskId()!),
    defaultValue: undefined,
  });
}

export default TasksDetailsPage;
