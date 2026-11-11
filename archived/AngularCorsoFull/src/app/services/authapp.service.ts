import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { authServerUrl } from '../app.constant';

export class AuthResponse{
  constructor(
    public codice : string,
    public messaggio : string
  ){}
}

@Injectable({
  providedIn: 'root'
})
export class AuthappService {

  constructor(private httpClient : HttpClient) { }
//export const tokenServerUrl="http://localhost:9100/auth"

  autenticaService(userId: string, password: string){
    let AuthString = "Basic " + window.btoa(userId + ":" + password);
    let headers = new HttpHeaders({Authorization: AuthString});
    return this.httpClient.get<AuthResponse>(
      authServerUrl,{headers}).pipe(
        map(data => {
          sessionStorage.setItem('Utente',userId);
          sessionStorage.setItem('AuthToken',AuthString);
          return data;
        })
      );
  }
  getAuthToken()  {
    if (this.isLogged())
      return sessionStorage.getItem("AuthToken");
    else 
      return '';
  }

  loggedUser(){
    let utente = sessionStorage.getItem("Utente");
    return utente!=null ? utente : '';
  }
  isLogged(){
    return this.loggedUser() ==='' ? false : true;
  }
  clearAll(){
    sessionStorage.clear();
  }
  
}
