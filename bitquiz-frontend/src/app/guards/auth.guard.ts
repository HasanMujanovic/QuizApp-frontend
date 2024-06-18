import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const protectedRoutes: String[] = [
    '/quizes',
    '/quiz-info',
    '/quizes-page',
    '/quiz-details/:id',
    '/quiz-playing/:id',
    '/done-quizes',
    '/user-details/:id',
    '/other-user-details/:id',
  ];
  let storage: Storage = sessionStorage;
  return protectedRoutes.includes(state.url) && storage.getItem('user') == null
    ? router.navigate([''])
    : true;
};
