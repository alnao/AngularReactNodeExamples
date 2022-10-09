import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookDetailComponent } from './componets/book-detail/book-detail.component';
import { BookComponent } from './componets/book/book.component';


const routes: Routes = [
  {path : 'book/:id', component: BookDetailComponent},
  {path : 'book', component: BookComponent},
  {path : '', component: BookComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
