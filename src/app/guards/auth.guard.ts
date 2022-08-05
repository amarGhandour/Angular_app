import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AppService} from '@services/app.service';
import {AuthService} from "@services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  private isAdmin = false;

  constructor(private router: Router, private appService: AppService, private authService: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.getProfile();
    }

    canActivateChild(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ):
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>
      | boolean
      | UrlTree {
      return this.canActivate(next, state);
    }

  getProfile() {

    this.appService.getProfile();

    if (this.appService.user) {
      this.appService.user.roles.forEach((role) => {
        if (role.name == 'Super Admin') {
          this.isAdmin = true;
        }
      });

      if (this.isAdmin) {
        return true;
      }

      return this.router.navigate(['403']) || false;
    }
    return this.router.navigate(['login']) || false;
    ;
  }
}
