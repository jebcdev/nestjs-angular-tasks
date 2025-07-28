import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
/*  */
import { AuthService } from '@/auth/services';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'front-tasks-layout-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-tasks-layout-header.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrontTasksLayoutHeader {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  public isMenuOpen = signal(false);

  public isAdmin = computed<boolean>(() => {
    return this.authService.isAdmin();
  });

  public userName = computed<string>(() => {
    return this.authService.user()?.name || '';
  });

  public toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  public closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  public logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/auth/login']);
  }
}
