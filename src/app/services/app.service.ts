import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
    return this.httpClient.post<any>(`${environment.api}/login`, JSON.stringify(user), this.httpOptions);
  }

  getProfile() {
    try {
      this.user = JSON.parse(localStorage.getItem('user'));
      if (this.user == null)
        this.logout();

      if (this.user != null)
        this.user.token = localStorage.getItem('access_token');

    } catch (error) {
      this.logout();
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('gatekeeper_token');
    this.user = null;
    this.router.navigate(['/login']);
  }
}
