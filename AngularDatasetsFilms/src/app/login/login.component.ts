import { Component, OnInit } from '@angular/core';
import { AuthappServiceService } from '../service/authapp-service.service';
import { Router } from '@angular/router';
//see https://www.w3schools.com/howto/howto_css_login_form.asp
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private service: AuthappServiceService,private router: Router) { }
  loading : boolean = false;

  ngOnInit(): void {  }
  login(){
    this.loading=true;
    let username="alnao";
    let password="password";
    this.service.autenticaService(username,password).subscribe(data => { //console.log("film list ok");
      if (data==="200"){
        this.router.navigate(['/lista']);
      }else{
        this.loading=false;
      }
    },(error) => { console.log(error);
      alert("Errore: " + error.message);
      this.loading=false;
    });
  }
}
