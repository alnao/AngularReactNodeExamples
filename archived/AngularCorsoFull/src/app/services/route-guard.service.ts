import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthappService } from './authapp.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate{
  constructor(private auth:AuthappService,private route: Router) { }
  
  token : string ='';
  ruoli : string[];
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    this.token=this.auth.getAuthToken();
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.token);
    this.ruoli = decodedToken['authorities'];

    if (! this.auth.isLogged()){
      this.route.navigate (  ['login'] );//KO
    }
    //return true;//this.auth.isLogged();
    //new jwt da qui in poi
    if ( route.data.roles == null || route.data.roles.lenght === 0 ) {
      return true; //non ci sono regole nel app.routing.ts
    }
    if (this.ruoli.some( r => route.data.roles.includes(r))){
      return true;//autorizzato
    }else{
      this.route.navigate( ['errorComponent']);
      return false;//non autorizzato
    }
    
  }

}
