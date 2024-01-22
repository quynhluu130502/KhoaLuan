/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const isLoggedIn = authService.isAuthenticated();
  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
