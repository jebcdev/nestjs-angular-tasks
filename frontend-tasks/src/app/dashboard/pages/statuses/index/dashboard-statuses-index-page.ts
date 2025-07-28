import { ChangeDetectionStrategy, Component, inject, ResourceRef } from '@angular/core';
/*  */
import { DashboardStatusesService } from '@/dashboard/services/statuses';
import {
  IsEmptyComponent,
  IsErrorComponent,
  IsLoadingComponent,
} from '@/common/components/resource-status';
import { DashboardStatusesTable } from './components';
import { Status } from '@/dashboard/interfaces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dashboard-statuses-index-page',
  imports: [
    IsEmptyComponent,
    IsErrorComponent,
    IsLoadingComponent,
    DashboardStatusesTable,
    RouterLink
  ],
  templateUrl: './dashboard-statuses-index-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStatusesIndexPage {
  private statusesService: DashboardStatusesService = inject(
    DashboardStatusesService
  );

  statusesRs: ResourceRef<Status[]> = this.statusesService.statusesRs;
}

export default DashboardStatusesIndexPage;
