import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
/*  */
import type { MenuItem } from '@/common/interfaces';
@Component({
  selector: 'dashboard-layout-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout-header.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutHeader {
  public isMenuOpen = signal(false);
  public menuItems = computed<MenuItem[]>(() => [
    {
      title: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      path: '/dashboard',
    },
    /*     {
      title: 'Usuarios',
      icon: 'fas fa-users',
      path: 'users',
    }, */
    {
      title: 'Estados',
      icon: 'fas fa-exclamation-triangle',
      path: 'statuses',
    },
    {
      title: 'Tareas',
      icon: 'fas fa-tasks',
      path: 'tasks',
    },
  ]);

  public toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  public closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}

export default DashboardLayoutHeader;
