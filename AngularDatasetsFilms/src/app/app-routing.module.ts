import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmsListComponent } from './films-list/films-list.component';
import { FilmDetailComponent } from './film-detail/film-detail.component';

const routes: Routes = [
  { path: '',           component: FilmsListComponent},
  { path: 'new', component: FilmDetailComponent},
  { path: 'detail/:id', component: FilmDetailComponent},
  { path: '**',           component: FilmsListComponent}, //todo 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
