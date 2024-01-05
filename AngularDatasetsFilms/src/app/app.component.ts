import { Component } from '@angular/core';
import { AuthappServiceService } from './service/authapp-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularDatasetsFilms';
  
  constructor(private route: Router,public basicAuth : AuthappServiceService) { }
  logout(){
    this.basicAuth.clearAll();
    this.route.navigate (  ['login'] );
  }
}
