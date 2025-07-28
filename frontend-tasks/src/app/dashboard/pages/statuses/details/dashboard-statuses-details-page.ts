import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
/*  */
import { DashboardStatusesService } from '@/dashboard/services';
import { IsEmptyComponent, IsErrorComponent, IsLoadingComponent } from '@/common/components/resource-status';
import { DashboardStatusesForm } from '@/dashboard/components';

@Component({
  selector: 'dashboard-statuses-details-page',
  imports: [    IsEmptyComponent,
      IsErrorComponent,
      IsLoadingComponent,
    DashboardStatusesForm],
  templateUrl: './dashboard-statuses-details-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStatusesDetailsPage {
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

export default DashboardStatusesDetailsPage;
