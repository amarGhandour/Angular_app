import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";
import Immutable from "immutable";
import {AppService} from "@services/app.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private appService: AppService, private router: Router, private toaster: ToastrService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((err) => {

        if (err.status == 401) {
          this.appService.logout();
          // location.reload();

        } else if (err.status == 403) {
          this.router.navigate(['403']);
        }

        return throwError(err);
      })
    );
  }
}
