import {Component, HostBinding, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AppService} from '@services/app.service';
import {AuthService} from "@services/auth.service";
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
    public isGoogleLoading = false;
    public isFacebookLoading = false;

    constructor(
      private renderer: Renderer2,
      private toastr: ToastrService,
      private appService: AppService,
      private authService: AuthService,
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
          console.log('err')
        }
      };

      this.authService.login(this.loginForm.value).subscribe(observer);
      this.isAuthLoading = false;
    } else {
            this.toastr.error('Form is not valid!');
        }
    }

    async loginByGoogle() {
        this.isGoogleLoading = true;
        await this.appService.loginByGoogle();
        this.isGoogleLoading = false;
    }

    async loginByFacebook() {
        this.isFacebookLoading = true;
        await this.appService.loginByFacebook();
        this.isFacebookLoading = false;
    }

    ngOnDestroy() {
        this.renderer.removeClass(
            document.querySelector('app-root'),
            'login-page'
        );
    }
}
