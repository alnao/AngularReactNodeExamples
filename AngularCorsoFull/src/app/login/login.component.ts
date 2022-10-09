import { Component, OnInit } from '@angular/core';
import { RouteReuseStrategy, Router } from '@angular/router';
import { AuthappService } from '../services/authapp.service';
import { AuthtokenService } from '../services/authtoken.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userid  = '';
  pwd     = '';
  autentitcato = true;
  errorMessage = 'Username o password errati';
  //consentito = false;
  //infoMessage ='Utente autenticato';


  constructor(private route : Router
    //, private authApp: AuthappService
    , private authApp : AuthtokenService
    ) {  }

  ngOnInit() {
  }

  gestAuth(){
    this.authApp.autenticaService(this.userid,this.pwd)
      .subscribe(res =>{console.log(res);
        this.autentitcato=true;
        this.route.navigate (  ['welcome',this.userid] );
      },error => {console.log(error);
        this.autentitcato=false;
      });
    /*
    if ( this.authApp.autentica(this.userid,this.pwd) ){
      this.autentitcato=true;
      this.route.navigate (  ['welcome',this.userid] );
    }else{
      this.autentitcato=false;
    }*/
  }

}
