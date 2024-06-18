import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const protectedRoutes: string[] = [
    '/create-quiz',
    '/made-quizes',
    '/edit-quizes/:id',
  ];
  let storage: Storage = sessionStorage;
  return JSON.parse(storage.getItem('role')) != 'admin' ||
    JSON.parse(storage.getItem('user')) == null
    ? router.navigate([''])
    : true;
};
