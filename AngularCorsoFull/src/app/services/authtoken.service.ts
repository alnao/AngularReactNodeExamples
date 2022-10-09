import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tokenServerUrl } from '../app.constant';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthtokenService {
  constructor(private httpClient : HttpClient) { }
  autenticaService(username: string, password: string){
    return this.httpClient.post<any>(
      tokenServerUrl,
      {username,password}//se messi così (con minuscole) funzia
      ).pipe(
        map(data => {console.log(`${data.token}`);
          sessionStorage.setItem('Utente',username);
          sessionStorage.setItem('AuthToken',`Bearer ${data.token}`);
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
