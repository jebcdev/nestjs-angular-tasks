import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IsEmptyComponent, IsErrorComponent, IsLoadingComponent } from '@/common/components/resource-status';
/*  */
import { DashboardStatusesForm } from '@/dashboard/components';
import { DashboardStatusesService } from '@/dashboard/services';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'dashboard-statuses-edit-page',
  imports: [IsEmptyComponent,
        IsErrorComponent,
        IsLoadingComponent,
      DashboardStatusesForm],
  templateUrl: './dashboard-statuses-edit-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStatusesEditPage {
    private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _dashboardStatusesService: DashboardStatusesService = inject(
    DashboardStatusesService
  );

  private statusId = toSignal(
    this._activatedRoute.paramMap.pipe(map((params) => params.get('id')))
  );

  public statusRs= rxResource({
    stream: () =>
      this._dashboardStatusesService.getStatusById(this.statusId()!),
    defaultValue: undefined,
  });
}

export default DashboardStatusesEditPage;
