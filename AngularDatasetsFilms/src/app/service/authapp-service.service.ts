import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthappServiceService {
  getConfigEndpoint(){
    return environment.loginEndpoint;
  }
  constructor(private httpClient : HttpClient) { }
  autenticaService(userId: string, password: string){
    let AuthString = "Bearer " + window.btoa(userId + ":" + password);
    let headers = new HttpHeaders({Authorization: AuthString});
    return this.httpClient.get<string>(
      this.getConfigEndpoint(),{headers}).pipe(
        map(data => {
          sessionStorage.setItem('Utente',userId);
          sessionStorage.setItem('AuthToken',data);
          return "200";
        })
      );
  }
  getAuthToken()  {
    if (this.isLogged())
      return ''+sessionStorage.getItem("AuthToken");
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
export enum Ruoli {
  utente="ROLE_USER",
  amministratore="ROLE_ADMIN"
}
export class AuthResponse{
  constructor(
    public codice : string,
    public messaggio : string
  ){}
}
