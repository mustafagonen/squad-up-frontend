import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.user$.pipe(
            take(1),
            map(user => {
                if (user) {
                    console.log(user);

                    return true; // Kullanıcı giriş yapmışsa erişime izin ver
                } else {
                    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
                    return this.router.createUrlTree(['/login']);
                }
            })
        );
    }
}