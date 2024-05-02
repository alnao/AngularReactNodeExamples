import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthappServiceService } from './authapp-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {
    constructor(private auth:AuthappServiceService,private route: Router) { }
    public token : string  ='';
    public ruoli : string[]=[];
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
      this.token=""+this.auth.getAuthToken();
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(this.token);
      this.ruoli = decodedToken['authorities'];
      if (! this.auth.isLogged()){
        this.route.navigate (  ['login'] );
      }
      if ( route.data['roles'] == null || route.data['roles'].lenght === 0 ) {
        return true; //non ci sono regole nel app.routing.ts
      }
      if (this.ruoli.some( r => route.data['roles'].includes(r))){
        return true;//autorizzato
      }else{
        alert("User not enabled");
        this.auth.clearAll();
        this.route.navigate( ['login']); //componente specifico o login
        return false;//non autorizzato
      }
    }
  }