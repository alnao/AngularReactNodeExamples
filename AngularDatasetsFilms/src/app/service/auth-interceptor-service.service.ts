import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthappServiceService } from './authapp-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorServiceService implements HttpInterceptor {
  constructor(private basicAuth : AuthappServiceService) { }
  intercept(request: HttpRequest<any>,next :HttpHandler) : Observable<HttpEvent<any>>{
    let AuthHeader = this.basicAuth.getAuthToken();//"Basic " + window.btoa(userId + ":" + password);
    if (AuthHeader!== '' && this.basicAuth.isLogged() ){
      request = request.clone({
        setHeaders : { 'Authorization' : AuthHeader }
      });
    }
    return next.handle(request);
  }
}