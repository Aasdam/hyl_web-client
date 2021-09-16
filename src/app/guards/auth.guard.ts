import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, Routes, UrlTree} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {PUBLIC_ROUTES} from '../layout/public-layout/public-layout.component';
import {SECURE_ROUTES} from '../layout/secure-layout/secure-layout.component';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  auth: string;
  private authSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService) {
    this.initAuthSubscription();
    this.authService.emitAuthSubject();
  }

  initAuthSubscription() {
    this.authSubscription = this.authService.authSubject.subscribe(
        (token: string) => {
          this.auth = token;
        }
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.guardService(route, route.firstChild.url[0].path);
  }

  canActivateChild(
      childRoute: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.guardService(childRoute, childRoute.routeConfig.path);
  }



  guardService(route: ActivatedRouteSnapshot, url: (string)) {
    if ( checkPathFromRoutes(url, [{path: 'erreur'}]) ) { return true; }

    if (this.auth !== null && this.auth !== 'null') {
      if (checkPathFromRoutes(url, PUBLIC_ROUTES)) {
        this.router.navigate(['/inventaire']);
      } else if (checkPathFromRoutes(url, SECURE_ROUTES)) {
        return true;
      }
    } else {
      if (checkPathFromRoutes(url, PUBLIC_ROUTES)) {
        return true;
      } else if (checkPathFromRoutes(url, SECURE_ROUTES)) {
        this.router.navigate(['/connexion']);
      }
    }


    function checkPathFromRoutes(pathToCheck: string, routes: Routes) {
      const count = routes.length;
      for (let i = 0; i < count; i++) {
        if (routes[i].path === pathToCheck) {
          return true;
        }
      }
      return false;
    }
  }
}
