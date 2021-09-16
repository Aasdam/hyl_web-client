import {Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaderResponse,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable()
export class ResponseErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401 || error.status === 0) {
                        this.authService.setAuthState(null, null);
                    }
                    return next.handle(req); // renvoi la réponse de la requête à l'envoyeur
                })
            );
    }
}
