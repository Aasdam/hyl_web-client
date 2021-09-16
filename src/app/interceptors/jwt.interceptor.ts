import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Ajout du token dans le header de la requête si l'utilisateur est connecté
        const token = this.authService.auth;
        const idUser = this.authService.idUser;
        if (token && idUser) {
            request = request.clone({
                headers: new HttpHeaders({
                    idUser,
                    Authorization: 'Bearer ' + token
                })
            });
        }
        return next.handle(request);
    }
}
