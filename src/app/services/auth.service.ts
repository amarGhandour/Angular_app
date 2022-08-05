import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions;

  constructor(private httpClient: HttpClient, private toaster: ToastrService) {
    this.httpOptions = this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
  }

  get isLoggedIn(): boolean {
    return localStorage.getItem('accessToken') != null;
  }

  login({email, password}): Observable<any> {
    const user = {email: email, password: password}
    return this.httpClient.post<any>(`${environment.api}/login`, JSON.stringify(user), this.httpOptions)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          // if (err.status == 404 && err.ok == false)
          //   this.toaster.error('Invalid email or password.');
          if (err.status == 401)
            this.toaster.error('Invalid email or password.');
          else if (err.status == 422) {
            let errors = this.getErrors(err.error.errors);
            errors.forEach(error => this.toaster.error(error))
          }

          return throwError('Error occurred, please try again');
        }));
  }

  getLoggedInUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  private getErrors(errors: any) {
    let mapped = [];
    errors.forEach((error) => {
      if (error instanceof Object) {
        Object.values(error).forEach((values) => {
          mapped.push(values);
        });
      }
    });

    errors = [];
    mapped.forEach((arr) => {
      arr.forEach(error => {
        errors.push(error);
      })
    })

    return errors;
  }

}
