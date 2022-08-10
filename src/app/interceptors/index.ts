import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {JwtInterceptor} from "@/interceptors/jwt.interceptor";
import {ErrorInterceptor} from "@/interceptors/error.interceptor";

export const httpInterceptorsProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  },
];
