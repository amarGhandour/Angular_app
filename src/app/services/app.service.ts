import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Gatekeeper} from 'gatekeeper-client-sdk';
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {throwError} from "rxjs";
import {IUser} from "@/interfaces/iuser";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public user: IUser = null;

  httpOptions;

  constructor(private router: Router, private httpClient: HttpClient, private toastr: ToastrService) {
    this.httpOptions = this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    };
  }

  loginByAuth({email, password}) {
    const user = {email: email, password: password}
    return this.httpClient.post<any>(`${environment.api}/login`, JSON.stringify(user), this.httpOptions)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          // if (err.status == 404 && err.ok == false)
          //   this.toaster.error('Invalid email or password.');
          if (err.status == 401)
            this.toastr.error('Invalid email or password.');
          else if (err.status == 422) {
            let errors = this.getErrors(err.error.errors);
            errors.forEach(error => this.toastr.error(error))
          }
          return throwError('Error occurred, please try again');
        }));
  }

  async registerByAuth({email, password}) {
    try {
      const token = await Gatekeeper.registerByAuth(email, password);
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.message);
    }
  }

  async loginByGoogle() {
    try {
      const token = await Gatekeeper.loginByGoogle();
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.message);
    }
  }

  async registerByGoogle() {
    try {
      const token = await Gatekeeper.registerByGoogle();
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.message);
    }
  }

  async loginByFacebook() {
    try {
      const token = await Gatekeeper.loginByFacebook();
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.message);
    }
  }

  async registerByFacebook() {
    try {
      const token = await Gatekeeper.registerByFacebook();
      localStorage.setItem('token', token);
      await this.getProfile();
      this.router.navigate(['/']);
    } catch (error) {
      this.toastr.error(error.message);
    }
  }

  getProfile() {
    try {
      this.user = JSON.parse(localStorage.getItem('user'));
      if (this.user == null)
        this.logout();

    } catch (error) {
      console.log(error)
      this.logout();
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('gatekeeper_token');
    this.user = null;
    this.router.navigate(['/login']);
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
