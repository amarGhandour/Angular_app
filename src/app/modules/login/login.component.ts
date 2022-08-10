import {Component, HostBinding, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AppService} from '@services/app.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'login-box';
  public loginForm: UntypedFormGroup;
  public isAuthLoading = false;
  errors: any = {};

    constructor(
      private renderer: Renderer2,
      private toastr: ToastrService,
      private appService: AppService,
      private router: Router
    ) {}

    ngOnInit() {
      this.renderer.addClass(
        document.querySelector('app-root'),
        'login-page'
      );
      this.loginForm = new UntypedFormGroup({
        email: new UntypedFormControl(null, Validators.required),
        password: new UntypedFormControl(null, Validators.required)
      });
    }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  loginByAuth() {
    if (this.loginForm.valid) {
      this.isAuthLoading = true;

      const observer = {
        next: (result) => {
          if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.data.user));
            localStorage.setItem('access_token', result.data.accessToken);
            this.appService.getProfile();
            this.router.navigate(['/'])
          }
        },
        error: (err) => {
          if (err.status == 401)
            this.toastr.error('Invalid email or password.');
          else if (err.status == 422) {
            for (let controlsKey in this.loginForm.controls) {
              this.loginForm.controls[controlsKey].markAsPristine();
              this.errors = err.error.errors;
            }
          }

        }
      };

      this.appService.loginByAuth(this.loginForm.value).subscribe(observer);
      this.isAuthLoading = false;
    } else {
            this.toastr.error('Form is not valid!');
        }
    }


    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
