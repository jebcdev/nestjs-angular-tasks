import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutHeader } from './components';

@Component({
  selector: 'dashboard-layout',
  imports: [DashboardLayoutHeader, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayout {}
export default DashboardLayout;