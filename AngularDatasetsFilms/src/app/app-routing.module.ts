import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmsListComponent } from './films-list/films-list.component';
import { FilmDetailComponent } from './film-detail/film-detail.component';
import { RouteGuardService } from './service/route-guard.service';
import { Ruoli } from './service/authapp-service.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'lista',           component: FilmsListComponent, canActivate:[RouteGuardService] ,data : {roles : [Ruoli.utente]}},
  { path: 'new', component: FilmDetailComponent, canActivate:[RouteGuardService] ,data : {roles : [Ruoli.utente]}},
  { path: 'detail/:id', component: FilmDetailComponent, canActivate:[RouteGuardService] ,data : {roles : [Ruoli.utente]}},
  { path: '',           component: LoginComponent}, //login without canActivate RouteGuardService or 404
  { path: 'login',           component: LoginComponent}, //login without canActivate RouteGuardService
  { path: '**',           component: LoginComponent}, //login without canActivate RouteGuardService or 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
