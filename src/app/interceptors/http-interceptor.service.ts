import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpErrorLoggingInterCeptor implements HttpInterceptor {
    constructor(
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if (request.headers.has('skipInterceptor')) {
            const headers = request.headers.delete('skipInterceptor');
            const clonedRequest = request.clone({ headers });
            return next.handle(clonedRequest);
        }

        const accessToken = localStorage.getItem('accessToken');
        request.headers.append("Access-Control-Allow-Origin", "*");
        request.headers.append("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
        request.headers.append("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");

        if (accessToken) {
            // If we have a token, we set it to the header
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` }
            });
        }

        else {
            if (!request.url.includes('Auths/Login')) {
                // window.location.href = '/';
            }
        }

        return next.handle(request).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {

        if (error.status === 500) { // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, body was: `, error.error?.detail);
            // this._toastrService.success(error.error?.Detail);
        }

        else if (error.status === 401) { // Un Authorization Error
            window.location.reload();
        }

        else { // A client-side or network error occurred. Handle it accordingly.
            // this._toastrService.success(error.error?.Detail);
            console.error('An error occurred:', error.error?.detail);
        }

        return throwError(() => new Error(error.error?.Errors ? error.error?.Errors[0].Errors[0] : error.error?.detail));  // Return an observable with a user-facing error message.
    }
}

