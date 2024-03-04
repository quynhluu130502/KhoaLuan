/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const refresh = await authService.getRefreshToken().toPromise();
  if (!refresh.token) {
    router.navigate(['/login']);
    return false;
  }
  localStorage.setItem('token', refresh.token);
  const res = await authService.getProtected().toPromise();
  if (res.result) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
