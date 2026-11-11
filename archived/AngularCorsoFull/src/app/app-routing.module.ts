import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ErrorRoutingComponent } from './error-routing/error-routing.component';
import { ArticoliComponent } from './articoli/articoli.component';
import { LogoutComponent } from './logout/logout.component';
import { RouteGuardService } from './services/route-guard.service';
import { EditartComponent } from './editart/editart.component';
import { Ruoli } from 'src/models/ruoli';


const routes: Routes = [
  {path : '', component : LoginComponent},    
  {path : 'login', component : LoginComponent},
  {path : 'logout', component : LogoutComponent},
  {path : 'errorComponent', component : ErrorRoutingComponent},
  {path : 'articoli', component : ArticoliComponent, canActivate:[RouteGuardService] ,data : {roles : [Ruoli.utente]}},
  {path : 'articoli/:filter', component : ArticoliComponent, canActivate:[RouteGuardService] ,data : {roles : [Ruoli.utente]}} ,
  {path : 'editart/:codArt' , component : EditartComponent, canActivate:[RouteGuardService] ,data : {roles : [Ruoli.amministratore]}} ,
  {path : 'index', component : LoginComponent, canActivate:[RouteGuardService] ,data : {roles : [Ruoli.utente]}},
  {path : 'welcome/:nomeUtente' , component : WelcomeComponent, canActivate:[RouteGuardService] ,data : {roles : [Ruoli.utente]} },
    //lasciare per ultimo per else-->errore
  {path : '**' , component : ErrorRoutingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
