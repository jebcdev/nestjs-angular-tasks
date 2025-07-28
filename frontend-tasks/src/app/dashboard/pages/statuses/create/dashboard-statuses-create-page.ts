import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
/*  */
import { DashboardStatusesService } from '@/dashboard/services';
import { DashboardStatusesForm } from '@/dashboard/components';
import { Status } from '@/dashboard/interfaces';

@Component({
  selector: 'dashboard-statuses-create-page',
  imports: [DashboardStatusesForm],
  templateUrl: './dashboard-statuses-create-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStatusesCreatePage {
  private _router: Router = inject(Router);
  private _dashboardStatusesService: DashboardStatusesService = inject(
    DashboardStatusesService
  );

  public emptyStatus: Status = {
    id: '',
    name: '',
    description: '',
    color: '#000000',
  
  };

  onStatusCreated(): void {
    this._router.navigate(['/dashboard/statuses']);
  }
}

export default DashboardStatusesCreatePage;
