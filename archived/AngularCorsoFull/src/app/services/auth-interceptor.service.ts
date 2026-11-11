import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthappService } from './authapp.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private basicAuth : AuthappService) { }
  intercept(request: HttpRequest<any>,next :HttpHandler) : Observable<HttpEvent<any>>{
    let AuthHeader = this.basicAuth.getAuthToken();//"Basic " + window.btoa(userId + ":" + password);
    if (AuthHeader!== ''){
      request = request.clone({
        setHeaders : { Authorization : AuthHeader }
      });
    }
    return next.handle(request);
  }
}
